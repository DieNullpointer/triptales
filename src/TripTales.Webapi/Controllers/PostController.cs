using AutoMapper;
using Castle.Core.Internal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net.WebSockets;
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

        private List<string> SplitString(List<string> input)
        {
            var list = new List<string>();
            foreach (var item in input)
            {
                list.Add(item.Split("wwwroot\\").Last());
            }
            return list;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _db.Posts.Include(a => a.Comments).Include(a => a.Likes).Include(a => a.User).Include(a => a.Days).ThenInclude(a => a.Locations).ToListAsync();
            var export = posts.Select(h => new
            {
                h.Guid,
                h.Begin,
                h.End,
                h.Title,
                h.Text,
                h.Created,
                Comments = h.Comments.Select(c => new
                {
                    c.User.RegistryName,
                    c.User.DisplayName,
                    c.Text,
                    c.Created
                }),
                Images = !Directory.Exists(Path.Combine("wwwroot", "Images", $"{h.Guid}")) ? null : SplitString(Directory.GetFiles(Path.Combine("wwwroot", "Images", $"{h.Guid}")).ToList()),
                Likes = h.Likes.Count,
                Days = h.Days.Select(d => new
                {
                    d.Guid,
                    d.Title,
                    d.Text,
                    d.Date,
                    Locations = d.Locations.Select(l => new
                    {
                        l.Coordinates,
                        Images = !Directory.Exists(Path.Combine("wwwroot", "Images", $"{l.Guid}")) ? null : SplitString(Directory.GetFiles(Path.Combine("wwwroot", "Images", $"{l.Guid}")).ToList()),
                    })
                }),
                User = new
                {
                    h.User!.Guid,
                    h.User!.RegistryName,
                    h.User.DisplayName,
                    h.User.ProfilePicture
                }
            });
            return Ok(export);
        }

        [HttpGet("{guid:Guid}")]
        public async Task<IActionResult> GetPost(Guid guid)
        {
            var h = await _db.Posts.Include(a => a.Comments).Include(a => a.User).Include(a => a.Days).ThenInclude(a => a.Locations).FirstOrDefaultAsync(a => a.Guid == guid);
            if (h is null) return BadRequest();
            var export = new
            {
                h.Guid,
                h.Begin,
                h.End,
                h.Title,
                h.Text,
                h.Created,
                Comments = h.Comments.Select(c => new
                {
                    c.User.RegistryName,
                    c.User.DisplayName,
                    c.Text,
                    c.Created
                }),
                Images = !Directory.Exists(Path.Combine("wwwroot", "Images", $"{h.Guid}")) ? null : SplitString(Directory.GetFiles(Path.Combine("wwwroot", "Images", $"{h.Guid}")).ToList()),
                Likes = h.Likes.Count,
                Days = h.Days.Select(d => new
                {
                    d.Guid,
                    d.Title,
                    d.Text,
                    d.Date,
                    Locations = d.Locations.Select(l => new
                    {
                        l.Coordinates,
                        Images = !Directory.Exists(Path.Combine("wwwroot", "Images", $"{l.Guid}")) ? null : SplitString(Directory.GetFiles(Path.Combine("wwwroot", "Images", $"{l.Guid}")).ToList()),
                    })
                }),
                User = new
                {
                    h.User!.Guid,
                    h.User!.RegistryName,
                    h.User.DisplayName,
                    h.User.ProfilePicture
                }
            };
            return Ok(export);
        }

        public record RegisterCmd
        (
            string Title,
            string Text,
            DateTime Begin,
            DateTime End,
            List<DayCmd> Days,
            List<IFormFile> Images
        );

        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddPost([FromForm] RegisterCmd postCmd)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var username = HttpContext?.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            // Valid token, but no user match in the database (maybe deleted by an admin).
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            var post = new TripPost(postCmd.Title, postCmd.Text, postCmd.Begin, postCmd.End, user);
            (bool success, string message) = await _repo.Insert(post);
            if(success)
            {
                string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images", $"{post.Guid}");
                if (!Directory.Exists(directoryPath))
                    Directory.CreateDirectory(directoryPath);
                var count = Directory.GetFiles(directoryPath).Count() + 1;
                foreach (var file in postCmd.Images)
                {
                    var path = Path.Combine(directoryPath, $"{count}.jpg");
                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    count++;
                }
                return Ok();
            }
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
            string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images", $"{guid}");
            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);
            var count = Directory.GetFiles(directoryPath).Count() + 1;
            foreach (var file in formFile)
            {
                var path = Path.Combine(directoryPath, $"{count}.jpg");
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                count++;
            }
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
            var post = await _db.Posts.Include(a => a.Likes).Include(a => a.User).Include(a => a.Days).ThenInclude(a => a.Locations).FirstOrDefaultAsync(a => a.Guid == guid);
            if(post is null) { return BadRequest("Post gibt es nicht"); }
            if (post.User != user)
                return BadRequest("This is not the Post of the User");
            post.User = null;
            if(Directory.Exists("PostImages"))
                foreach (var file in Directory.GetFiles("PostImages"))
                    System.IO.File.Delete(file);
            _db.Locations.RemoveRange(_db.Locations.Include(a => a.TripDay).ThenInclude(a => a.Post).Where(a => a.TripDay.Post == post).ToList());
            _db.Days.RemoveRange(post.Days);
            _db.Comments.RemoveRange(_db.Comments.Include(a => a.Post).Where(a => a.Post == post).ToList());
            _db.Posts.Remove(post);
            try { await _db.SaveChangesAsync(); }
            catch(DbUpdateException e) { return BadRequest(e.Message); }
            return Ok();
        }

        [Authorize]
        [HttpDelete("deleteDay/{guid:Guid}")]
        public async Task<IActionResult> DeleteDay(Guid guid)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var username = HttpContext?.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            var day = await _db.Days.Include(a => a.Locations).Include(a => a.Post).ThenInclude(a => a!.User).FirstOrDefaultAsync(a => a.Guid == guid);
            if (day is null) { return BadRequest("Day gibt es nicht"); }
            if (day.Post?.User?.RegistryName != username) { return BadRequest("User is not the author"); }
            day.Post = null;
            _db.Locations.RemoveRange(day.Locations);
            _db.Days.Remove(day);
            try
            {
                await _db.SaveChangesAsync();
            }
            catch(DbUpdateException e) { return BadRequest(e.Message); }
            return Ok();


        }

        /// <summary>
        /// /api/post/random?start=42746&itemNr=2
        /// </summary>
        /// <param name="itemNr"></param>
        /// <returns></returns>
        [HttpGet("random")]
        public async Task<IActionResult> GetRandom([FromQuery] int start = 0, [FromQuery] int itemNr = 0) 
        {
            var count = _db.Posts.Count();
            if (itemNr >= count) return NotFound();

            int nr = (start+itemNr)%count;
            var post = await _db.Posts.Include(a => a.Comments).Include(a => a.Likes).Include(a => a.Days).ThenInclude(a => a.Locations).Include(a => a.User).OrderBy(p=>p.Guid).Skip(nr).FirstOrDefaultAsync();
            if(post is null) return NotFound();
            var export = new
            {
                post.Guid,
                post.Begin,
                post.End,
                post.Created,
                post.Text,
                Likes = post.Likes.Count,
                post.Title,
                Comments = post.Comments.Select(c => new
                {
                    c.User.RegistryName,
                    c.User.DisplayName,
                    c.Text,
                    c.Created
                }),
                Days = post.Days.Select(d => new
                {
                    d.Guid,
                    d.Title,
                    d.Text,
                    d.Date,
                    Locations = d.Locations.Select(l => new
                    {
                        l.Coordinates,
                        Images = !Directory.Exists(Path.Combine("wwwroot", "Images", $"{l.Guid}")) ? null : SplitString(Directory.GetFiles(Path.Combine("wwwroot", "Images", $"{l.Guid}")).ToList()),
                    })
                }),
                User = new
                {
                    post.User!.Guid,
                    post.User!.RegistryName,
                    post.User.DisplayName,
                    post.User.ProfilePicture
                }
            };
            return Ok(export);
        }

        [Authorize]
        [HttpPut("addDay/{guid:Guid}")]
        public async Task<IActionResult> AddDay(Guid guid, DayCmd dayCmd)
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
            var day = _mapper.Map<TripDay>(dayCmd, opt => opt.AfterMap((dto, entity) =>
            {
                entity.Post = post;
            }));
            post.Days.Add(day);
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException e) { return BadRequest(e.Message); }
            return Ok();
        }

        [Authorize]
        [HttpPut("like/{guid:Guid}")]
        public async Task<IActionResult> LikePost(Guid guid)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var username = HttpContext?.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            // Valid token, but no user match in the database (maybe deleted by an admin).
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            var post = await _db.Posts.Include(a => a.User).Include(a => a.Likes).FirstOrDefaultAsync(a => a.Guid == guid);
            if (post is null) return BadRequest("Diesen Post gibt es nicht");
            if (post.Likes.Contains(user))
            {
                post.Likes.Remove(user);
                var notification = _db.Notifications.FirstOrDefault(a => a.User == post.User && a.NotificationType == NotificationType.Like && a.Sender == user);
                if(notification is not null)
                    _db.Notifications.Remove(notification);
            }
            else
            {
                post.Likes.Add(user);
                var notification = new Notification(post.User!, NotificationType.Like, user);
                _db.Notifications.Add(notification);
            }
            try { await _db.SaveChangesAsync(); }
            catch (DbUpdateException e) { return BadRequest(e.Message); }
            return Ok(post.Likes.Count());
        }

        [Authorize]
        [HttpPut("comment/remove/{guid:Guid}")]
        public async Task<IActionResult> RemoveComment(Guid guid)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var username = HttpContext?.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            // Valid token, but no user match in the database (maybe deleted by an admin).
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            var comment = await _db.Comments.Include(a => a.User).Include(a => a.Post).FirstOrDefaultAsync(a => a.Guid == guid);
            if (comment is null) return BadRequest("Diesen Kommentar gibt es nicht");
            if (comment.User != user) return BadRequest("Dieser Kommentar gehört nicht dir");
            var h = comment.Post;
            _db.Comments.Remove(comment);
            try { await _db.SaveChangesAsync(); }
            catch (DbUpdateException e) { return BadRequest(e.Message); }
            return Ok(new
            {
                h.Guid,
                h.Begin,
                h.End,
                h.Title,
                h.Text,
                h.Created,
                Comments = h.Comments.Select(c => new
                {
                    c.User.RegistryName,
                    c.User.DisplayName,
                    c.Text,
                    c.Created
                }),
                Images = !Directory.Exists(Path.Combine("wwwroot", "Images", $"{h.Guid}")) ? null : SplitString(Directory.GetFiles(Path.Combine("wwwroot", "Images", $"{h.Guid}")).ToList()),
                Likes = h.Likes.Count,
                Days = h.Days.Select(d => new
                {
                    d.Guid,
                    d.Title,
                    d.Text,
                    d.Date,
                    Locations = d.Locations.Select(l => new
                    {
                        l.Coordinates,
                        Images = !Directory.Exists(Path.Combine("wwwroot", "Images", $"{l.Guid}")) ? null : SplitString(Directory.GetFiles(Path.Combine("wwwroot", "Images", $"{l.Guid}")).ToList()),
                    })
                }),
                User = new
                {
                    h.User!.Guid,
                    h.User!.RegistryName,
                    h.User.DisplayName,
                    h.User.ProfilePicture
                }
            });
        }

        [Authorize]
        [HttpPut("comment")]
        public async Task<IActionResult> Comment(CommentCmd commentCmd)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated)
            {
                return Unauthorized();
            }
            var username = HttpContext?.User.Identity?.Name;
            if (username is null)
            {
                return Unauthorized();
            }
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            var h = await _db.Posts.Include(a => a.User).Include(a => a.Likes).FirstOrDefaultAsync(a => a.Guid == commentCmd.postGuid);
            if (h is null) return BadRequest("Diesen Post gibt es nicht");
            var comment = new Comment(user, commentCmd.text, DateTime.UtcNow, h);
            _db.Comments.Add(comment);
            try { await _db.SaveChangesAsync(); }
            catch (DbUpdateException e) { return BadRequest(e.Message); }
            return Ok(new
            {
                h.Guid,
                h.Begin,
                h.End,
                h.Title,
                h.Text,
                h.Created,
                Comments = h.Comments.Select(c => new
                {
                    c.User.RegistryName,
                    c.User.DisplayName,
                    c.Text,
                    c.Created
                }),
                Images = !Directory.Exists(Path.Combine("wwwroot", "Images", $"{h.Guid}")) ? null : SplitString(Directory.GetFiles(Path.Combine("wwwroot", "Images", $"{h.Guid}")).ToList()),
                Likes = h.Likes.Count,
                Days = h.Days.Select(d => new
                {
                    d.Guid,
                    d.Title,
                    d.Text,
                    d.Date,
                    Locations = d.Locations.Select(l => new
                    {
                        l.Coordinates,
                        Images = !Directory.Exists(Path.Combine("wwwroot", "Images", $"{l.Guid}")) ? null : SplitString(Directory.GetFiles(Path.Combine("wwwroot", "Images", $"{l.Guid}")).ToList()),
                    })
                }),
                User = new
                {
                    h.User!.Guid,
                    h.User!.RegistryName,
                    h.User.DisplayName,
                    h.User.ProfilePicture
                }
            });
        }
    }
}
