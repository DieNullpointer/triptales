using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TripTales.Application.Dto;
using TripTales.Application.Infrastructure;
using TripTales.Application.Infrastructure.Repositories;
using TripTales.Application.Model;

namespace TripTales.Webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : EntityReadController<TripPost>
    {
        private readonly PostRepository _repo;

        public PostController(TripTalesContext db, IMapper mapper, PostRepository repo) : base(db, mapper)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _db.Posts.Include(a => a.User).Include(a => a.Likes).Include(a => a.Images).Include(a => a.Days).ThenInclude(a => a.Locations).ToListAsync();
            return Ok(posts.Select(h => new
            {
                h.Guid,
                h.Begin,
                h.End,
                h.Title,
                h.Text,
                h.Created,
                Images = h.Images.Select(async i => new
                {
                    Image = File(await System.IO.File.ReadAllBytesAsync(i.Path), "image/jpeg").FileContents,
                }),
                Likes = h.Likes.Count,
                Days = h.Days.Select(d => new
                {
                    d.Title,
                    d.Text,
                    d.Date,
                    d.Images,
                    Locations = d.Locations.Select(l => new
                    {
                        l.Coordinates,
                        l.Images
                    })
                }),
                User = new
                {
                    h.User!.Guid,
                    h.User!.RegistryName,
                    h.User!.DisplayName
                }
            }));
        }

        [HttpGet("{guid:Guid}")]
        public async Task<IActionResult> GetPost(Guid guid) => await GetByGuid(guid, h =>
            new
            {
                h.Guid,
                h.Begin,
                h.End,
                h.Title,
                h.Text,
                h.Created,
                h.Images,
                Likes = h.Likes.Count,
                Days = h.Days.Select(d => new
                {
                    d.Title,
                    d.Text,
                    d.Date,
                    d.Images,
                    Locations = d.Locations.Select(l => new
                    {
                        l.Coordinates,
                        l.Images
                    })
                }),
                User = new
                {
                    h.User!.Guid,
                    h.User!.RegistryName,
                    h.User!.DisplayName
                }
            });

        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddPost([FromBody] PostCmd postCmd)
        {
            var username = HttpContext?.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            // Valid token, but no user match in the database (maybe deleted by an admin).
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            var post = _mapper.Map<TripPost>(postCmd, opt => opt.AfterMap((dto, entity) =>
            {
                entity.Created = DateTime.UtcNow;
                entity.User = user;
            }));
            (bool success, string message) = await _repo.Insert(post);
            if(success) { return Ok(); }
            return BadRequest(message);
        }

        [Authorize]
        [HttpPost("addImages/{guid:Guid}")]
        public async Task<IActionResult> AddImages(Guid guid, [FromForm] IFormFile formFile)
        {
            var username = HttpContext?.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            // Valid token, but no user match in the database (maybe deleted by an admin).
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            var post = await _db.Posts.FirstOrDefaultAsync(a => a.Guid == guid);
            if (post is null)
                return BadRequest("Diesen Post gibt es nicht");
            string path = Path.Combine(Directory.GetCurrentDirectory(), "PostImages", $"{guid}");
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
            path = Path.Combine(path, $"{DateTime.UtcNow.ToString("yyyy-MM-dd")}.{formFile.FileName.Split(".").Last()}");
            post.Images.Add(new Image(path, Path.GetFileNameWithoutExtension(path)));
            try
            {
                await _db.SaveChangesAsync();
            }
            catch(DbUpdateException e) { return BadRequest(e.Message); }
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await formFile.CopyToAsync(stream);
            }
            return Ok();
        }

        [Authorize]
        [HttpDelete("delete/{guid:Guid}")]
        public async Task<IActionResult> DeletePost(Guid guid)
        {
            var username = HttpContext?.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            // Valid token, but no user match in the database (maybe deleted by an admin).
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            var post = await _db.Posts.FirstOrDefaultAsync(a => a.Guid == guid);
            if(post is null) { return BadRequest("Post gibt es nicht"); }
            if (!user.Posts.Contains(post))
                return BadRequest("This is not the Post of the User");
            post.User = null;
            user.Posts.Remove(post);
            if(Directory.Exists("PostImages"))
                foreach (var file in Directory.GetFiles("PostImages"))
                    System.IO.File.Delete(file);
            (bool success, string message) = await _repo.Delete(guid);
            if (success) { return Ok(); }
            return BadRequest(message);
        }
    }
}
