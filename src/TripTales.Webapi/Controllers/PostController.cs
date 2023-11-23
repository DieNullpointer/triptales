using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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
        public async Task<IActionResult> GetAllPosts() => await GetAll(h => new
        {
            h.Guid,
            h.Begin,
            h.End,
            h.Title,
            h.Text,
            h.Created,
            Images = h.Images.Select(i => new
            {
                Image = i.Path,
            }),
            Likes = h.Likes.Count,
            Days = h.Days.Select(d => new
            {
                d.Title,
                d.Text,
                d.Date,
                Locations = d.Locations.Select(l => new
                {
                    l.Coordinates,
                    Images = l.Images.Select(i => new
                    {
                        Image = i.Path,
                    }),
                })
            }),
            User = new
            {
                h.User!.Guid,
                h.User!.RegistryName,
                h.User.DisplayName,
                ProfilePicture = System.IO.File.Exists(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Pictures", $"{h.User.RegistryName}-profile.jpg")) ? $"Pictures/{h.User.RegistryName}-profile.jpg" : null
            }
        });

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
                Images = h.Images.Select(i => new
                {
                    Image = i.Path,
                }),
                Likes = h.Likes.Count,
                Days = h.Days.Select(d => new
                {
                    d.Title,
                    d.Text,
                    d.Date,
                    Locations = d.Locations.Select(l => new
                    {
                        l.Coordinates,
                        Images = l.Images.Select(i => new
                        {
                            Image = i.Path,
                        }),
                    })
                }),
                User = new
                {
                    h.User!.Guid,
                    h.User!.RegistryName,
                    h.User!.DisplayName,
                    ProfilePicture = System.IO.File.Exists(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Pictures", $"{h.User.RegistryName}-profile.jpg")) ? $"Pictures/{h.User.RegistryName}-profile.jpg" : null
                }
            });

        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddPost([FromBody] PostCmd postCmd)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
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
        [HttpPut("addImages/{guid:Guid}")]
        public async Task<IActionResult> AddImages(Guid guid, [FromForm] List<IFormFile> formFile)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var username = HttpContext?.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            // Valid token, but no user match in the database (maybe deleted by an admin).
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            var post = await _db.Posts.FirstOrDefaultAsync(a => a.Guid == guid);
            if (post is null)
                return BadRequest("Diesen Post gibt es nicht");
            string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "PostImages", $"{guid}");
            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);
            List<Image> images = new();
            var count = Directory.GetFiles($"PostImages/{guid}").Count() + 1;
            foreach (var file in formFile)
            {
                var path = Path.Combine(directoryPath, $"{count}.jpg");
                images.Add(new Image(path, count.ToString()));
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                count++;
            }
            await _db.Images.AddRangeAsync(images);
            try
            {
                await _db.SaveChangesAsync();
            }
            catch(DbUpdateException e) { return BadRequest(e.Message); }
            return Ok();
        }

        [Authorize]
        [HttpDelete("delete/{guid:Guid}")]
        public async Task<IActionResult> DeletePost(Guid guid)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
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
