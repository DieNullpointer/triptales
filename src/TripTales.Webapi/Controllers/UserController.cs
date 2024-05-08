using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using TripTales.Application.Dto;
using TripTales.Application.Infrastructure;
using TripTales.Application.Infrastructure.Repositories;
using TripTales.Application.Model;
using TripTales.Webapi.Services;

namespace TripTales.Webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class UserController : EntityReadController<User>
    {
        private readonly IEmailSender _emailSender;
        private readonly UserRepository _repo;
        private readonly IConfiguration _config;
        private static string[] _allowedExtensions = new string[] { ".jpg", ".jpeg", ".png", ".gif" };

        public UserController(TripTalesContext db, IMapper mapper, UserRepository repo, IEmailSender emailSender, IConfiguration config) : base(db, mapper)
        {
            _repo = repo;
            _emailSender = emailSender;
            _config = config;
        }

        [Authorize]
        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var username = HttpContext.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            var user = await _db.User.Include(a => a.Notifications).ThenInclude(a => a.Sender).FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            var export = user.Notifications.Select(a => new
            {
                //The text changes depending on the notification type
                Text = a.NotificationType switch
                {
                    NotificationType.Follow => $"{a.Sender?.RegistryName} started following you",
                    NotificationType.Like => $"{a.Sender?.RegistryName} liked your post",
                    NotificationType.SystemNews => "System News",
                    _ => "Unknown"
                },
                NotificationType = a.NotificationType.ToString(),
                a.IsRead
            }).ToList();
            //Mark all notifications as read and save
            foreach (var notification in user.Notifications)
            {
                notification.IsRead = true;
            }
            try { await _db.SaveChangesAsync(); }
            catch (DbUpdateException e) { return BadRequest(e.Message); }
            return Ok(export);
        }

        [Authorize]
        [HttpPost("emailToken")]
        public async Task<IActionResult> CreateEmailToken()
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var username = HttpContext.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            var token = RandomToken();
            user.EmailResetToken = token;
            try { await _db.SaveChangesAsync(); }
            catch (DbUpdateException e) { return BadRequest(e.Message); }
            await _emailSender.SendEmailAsync(user.Email, "TripTales Email Change", $"<p>Beim folgenden Link kann die Email geändert werden: <a href='{_config["RedirectEmailChange"]}{token}'>{_config["RedirectEmailChange"]}{token}</a>.<br><p>Mit freundlichen Grüßen</p><br><p>Ihr TripTales Team</p>");
            return Ok();
        }

        public record ChangeEmailCmd(string token, string email);
        [HttpPost("changeEmail")]
        public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailCmd change)
        {
            var user = await _db.User.FirstOrDefaultAsync(a => a.EmailResetToken == change.token);
            if (user is null) return BadRequest("Token gibt es nicht");
            user.Email = change.email;
            user.EmailResetToken = null;
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException e) { return BadRequest(e.Message); }
            return Ok();
        }

        public record ResetPasswordCmd(string token, string password);
        [HttpPost("resetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCmd reset)
        {
            var user = await _db.User.FirstOrDefaultAsync(a => a.PasswordResetToken == reset.token);
            if (user is null) return BadRequest("Token gibt es nicht");
            user.PasswordResetToken = null;
            user.SetPassword(reset.password);
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException e) { return BadRequest(e.Message); }
            return Ok();
        }

        [HttpGet("forgotPassword/{email}")]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            var user = await _db.User.FirstOrDefaultAsync(a => a.Email == email);
            if (user is null) return BadRequest("User gibt es nicht");
            var token = RandomToken();
            user.PasswordResetToken = token;
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException e) { return BadRequest(e.Message); }
            await _emailSender.SendEmailAsync(email, "TripTales Password Reset", $"<p>Beim folgenden Link kann das Password zurückgesetzt werden: <a href='{_config["RedirectPasswordReset"]}{token} '> {_config["RedirectPasswordReset"]}{token}</a>.<br><p>Mit freundlichen Grüßen</p><br><p>Ihr TripTales Team</p>");
            var url = _config["RedirectPasswordReset"];
            return Ok();
        }

        private string RandomToken()
        {
            var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
            if (_db.User.Any(a => a.PasswordResetToken == token))
                return RandomToken();
            return token;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterCmd user)
        {
            var user1 = _mapper.Map<User>(user);
            user1.DisplayName = user1.RegistryName;
            try
            {
                await _db.User.AddAsync(user1);
                await _db.SaveChangesAsync();
            }
            catch(DbUpdateException e)
            {
                return BadRequest(e.Message);
            }
            return Ok(user1.Guid);
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers() => await GetAll(h => 
            new
            {
                h.Guid,
                FollowerCount = h.FollowerRecipient.Count,
                Following = h.FollowerSender.Select(a => new
                {
                    User = new
                    {
                        a.Recipient.Guid,
                        a.Recipient.RegistryName,
                        a.Recipient.DisplayName
                    },
                }),
                FollowingCount = h.FollowerSender.Count,
                Follower = h.FollowerRecipient.Select(a => new
                {
                    User = new
                    {
                        a.Sender.Guid,
                        a.Sender.RegistryName,
                        a.Sender.DisplayName
                    },
                }),
                h.DisplayName,
                h.Email,
                h.RegistryName,
                h.Description,
                h.Origin,
                h.FavDestination,
                Posts = h.Posts.Select(p => new
                {
                    p.Guid
                })
            });

        [HttpGet("{guid:Guid}")]
        public async Task<IActionResult> GetUser(Guid guid) => await GetByGuid<UserDto>(guid);

        [HttpGet("search/{username}")]
        public async Task<IActionResult> SearchUser(string username)
        {
            return Ok(await _db.User.Where(a => a.RegistryName.Contains(username)).Select(a => new
            {
                a.ProfilePicture,
                a.Guid,
                a.DisplayName,
                a.RegistryName
            }).OrderBy(a => a.RegistryName).ToListAsync());
        }

        public record UploadImagesCmd(IFormFile? banner, IFormFile? profile);
        [Authorize]
        [HttpPut("addImages")]
        public async Task<IActionResult> UpdateImages([FromForm] UploadImagesCmd upload)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var username = HttpContext?.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            // Valid token, but no user match in the database (maybe deleted by an admin).
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            // If the folder does not exist, create it.
            if(upload.banner is not null)
            {
                if (upload.banner.Length > 5242880) return BadRequest("Invalid filesize.");
                var extension = new FileInfo(upload.banner.FileName).Extension;
                if (!_allowedExtensions.Contains(extension)) return BadRequest("Invalid extension.");
                var filename = Guid.NewGuid().ToString("n") + extension;
                using (var destStream = new FileStream(Path.Combine(_config["UploadDirectory"], filename), FileMode.Create, FileAccess.Write))
                {
                    await upload.banner.CopyToAsync(destStream);
                }

                user.BannerPicture = $"{_config["UploadDirectory"]}/{filename}";
            }
            if(upload.profile is not null)
            {
                if (upload.profile.Length > 5242880) return BadRequest("Invalid filesize.");
                var extension = new FileInfo(upload.profile.FileName).Extension;
                if (!_allowedExtensions.Contains(extension)) return BadRequest("Invalid extension.");
                var filename = Guid.NewGuid().ToString("n") + extension;
                using (var destStream = new FileStream(Path.Combine(_config["UploadDirectory"], filename), FileMode.Create, FileAccess.Write))
                {
                    await upload.profile.CopyToAsync(destStream);
                }
                user.ProfilePicture = $"{_config["UploadDirectory"]}/{filename}";
            }
            await _db.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpGet("{registryName}")]
        public async Task<IActionResult> GetUserByRegistryName(string registryName)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            bool isFollowing = false;
            if (authenticated)
            {
                var username = HttpContext.User.Identity?.Name;
                if (username is null) { return Unauthorized(); }
                // Valid token, but no user match in the database (maybe deleted by an admin).
                var userSender = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
                if (userSender is null) { return Unauthorized(); }
                var userRecipient = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == registryName);
                if (userRecipient is null) { return BadRequest(); }
                var follow = await _db.Follower.FirstOrDefaultAsync(a => a.Sender == userSender && a.Recipient == userRecipient);
                if (follow is not null)
                    isFollowing = true;
            }
            var user = await _db.User.Include(a => a.Posts).Include(a => a.FollowerRecipient).ThenInclude(a => a.Sender).Include(a => a.FollowerSender).ThenInclude(a => a.Recipient).FirstOrDefaultAsync(u => u.RegistryName == registryName);
            if (user is null) return BadRequest("User gibt es nicht");

            var test = new
            {
                User = new
                {
                    user.RegistryName,
                    user.DisplayName,
                    user.Guid,
                    user.Description,
                    user.Origin,
                    user.FavDestination,
                    Posts = user.Posts.Select(p => new
                    {
                        p.Guid,
                        p.Title,
                        p.Text,
                        p.Begin,
                        p.End,
                        p.Created,
                        p.Likes.Count,
                        Liking = p.Likes.Any(a => a.Guid == user?.Guid),
                    }),
                    Likes = user.Likes.Count,
                    Follow = isFollowing,
                    FollowerCount = user.FollowerRecipient.Count,
                    Following = user.FollowerSender.Select(a => new
                    {
                        User = new
                        {
                            a.Recipient.Guid,
                            a.Recipient.RegistryName,
                            a.Recipient.DisplayName
                        },
                    }),
                    FollowingCount = user.FollowerSender.Count,
                    Follower = user.FollowerRecipient.Select(a => new
                    {
                        User = new
                        {
                            a.Sender.Guid,
                            a.Sender.RegistryName,
                            a.Sender.DisplayName
                        },
                    }),
                },
                Profile = user.ProfilePicture,
                Banner = user.BannerPicture
            };
            return Ok(test);
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetUserdata()
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var username = HttpContext.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            var user = _db.User.Include(a => a.Notifications.Where(n => n.IsRead == false)).FirstOrDefault(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            return Ok(new
            {
                user.ProfilePicture,
                user.BannerPicture,
                user.DisplayName,
                Username = user.RegistryName,
                user.Description,
                user.Email,
                user.Origin,
                user.FavDestination,
                user.Guid,
                user.Notifications.Count,
            });
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return NoContent();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserCredentialsCmd credentials)
        {
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == credentials.registryName);
            if (user is null || !user.CheckPassword(credentials.password)) return BadRequest("Password falsch oder User gibt es nicht");
            var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, credentials.registryName),
                        //new Claim(ClaimTypes.Role, "admin")
                    };
            var claimsIdentity = new ClaimsIdentity(
                claims,
                Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                AllowRefresh = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddHours(3),
            };

            await HttpContext.SignInAsync(
                Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);
            return Ok(new { Username = credentials.registryName });
        }

        [Authorize]
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteUser()
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var username = HttpContext.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            // Valid token, but no user match in the database (maybe deleted by an admin).
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            (bool success, string message) = await _repo.Delete(user.Guid);
            if(success) { return Ok(); }
            return BadRequest(message);
        }

        [Authorize]
        [HttpPut("change")]
        public async Task<IActionResult> ChangeUser([FromBody] UserCmd userCmd)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var username = HttpContext.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            // Valid token, but no user match in the database (maybe deleted by an admin).
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            user = _mapper.Map<User>(userCmd, opt =>
            {
                opt.AfterMap((src, dest) =>
                {
                    dest.Guid = user.Guid;
                });
            });
            (bool success, string message) = await _repo.Update(user);
            if (success) return Ok();
            return BadRequest(message);
        }

        [Authorize]
        [HttpPost("follow/{username}")]
        public async Task<IActionResult> Follow(string username)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var registryName = HttpContext.User.Identity?.Name;
            var userSender = await _db.User.FirstOrDefaultAsync(u => u.RegistryName == registryName);
            if (userSender is null) { return Unauthorized(); }
            var userRecipient = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (userRecipient is null) { return BadRequest(); }
            var follow = await _db.Follower.FirstOrDefaultAsync(a => a.Sender == userSender && a.Recipient == userRecipient);
            if (follow is not null)
            {
                _db.Follower.Remove(follow);
                _db.Notifications.RemoveRange(_db.Notifications.Where(a => a.User == userRecipient && a.Sender == userSender && a.NotificationType == NotificationType.Follow));
                try { await _db.SaveChangesAsync(); }
                catch (DbUpdateException e) { return BadRequest(e.Message); }
                return Ok(_db.Follower.Where(a => a.Recipient.Guid == userRecipient.Guid).Count());
            }
            var follower = new Follower(userSender, userRecipient, DateTime.UtcNow.Date);
            _db.Follower.Add(follower);
            var notification = new Notification(userRecipient, NotificationType.Follow, userSender);
            _db.Notifications.Add(notification);
            try { await _db.SaveChangesAsync(); }
            catch (DbUpdateException e) { return BadRequest(e.Message); }
            return Ok(_db.Follower.Where(a => a.Recipient.Guid == userRecipient.Guid).Count());
        }
    }
}
