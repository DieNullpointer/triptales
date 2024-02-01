using AutoMapper;
using Bogus.DataSets;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TripTales.Application.Dto;
using TripTales.Application.Infrastructure;
using TripTales.Application.Infrastructure.Repositories;
using TripTales.Application.Model;
using TripTales.Application.Services;

namespace TripTales.Webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class UserController : EntityReadController<User>
    {
        private readonly AuthService _authService;
        private readonly UserRepository _repo;

        public UserController(TripTalesContext db, IMapper mapper, AuthService authService, UserRepository repo) : base(db, mapper)
        {
            _authService = authService;
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterCmd user)
        {
            var user1 = _mapper.Map<User>(user);
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

        /*[HttpGet("image/{guid:Guid}")]
        public IActionResult GetPicutre(Guid guid)
        {
            var user = _db.User.FirstOrDefault(a => a.Guid == guid);
            if (user is null) return BadRequest("User gibt es nicht");
            var myfile = System.IO.File.ReadAllBytes($"Pictures/{user.RegistryName}-picture.jpg");
            var test = new
            {
                User = user,
                Profile = File(myfile, "image/jpeg")
            };
            return Ok(test);
        }*/

        [HttpGet("{guid:Guid}")]
        public async Task<IActionResult> GetUser(Guid guid) => await GetByGuid<UserDto>(guid);

        [HttpGet("search/{username}")]
        public async Task<IActionResult> SearchUser(string username)
        {
            return Ok(await _db.User.Where(a => a.RegistryName.Contains(username)).Select(a => new
            {
                a.Guid,
                a.DisplayName,
                a.RegistryName
            }).ToListAsync());
        }

        [Authorize]
        [HttpPut("addImages")]
        public async Task<IActionResult> UpdateImages([FromForm] IFormFile? banner, IFormFile? profile)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var username = HttpContext?.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }
            // Valid token, but no user match in the database (maybe deleted by an admin).
            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Pictures");
            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);
            var bannerPath = Path.Combine(directoryPath, $"{username}-banner.jpg");
            var profilePath = Path.Combine(directoryPath, $"{username}-profile.jpg");
            if(banner is not null)
            {
                using (var stream = new FileStream(bannerPath, FileMode.Create))
                {
                    await banner.CopyToAsync(stream);
                }
            }
            if(profile is not null)
            {
                using (var stream = new FileStream(profilePath, FileMode.Create))
                {
                    await profile.CopyToAsync(stream);
                }
            }
            return Ok();
        }
        
        [HttpGet("{registryName}")]
        public async Task<IActionResult> GetUserByRegistryName(string registryName)
        {
            var user = await _db.User.FirstOrDefaultAsync(u => u.RegistryName == registryName);
            if (user is null) return BadRequest("User gibt es nicht");
            string? profile = Path.Combine(Directory.GetCurrentDirectory(), $"wwwroot/Pictures/{registryName}-profile.jpg").Replace("\\", "/");
            string? banner = Path.Combine(Directory.GetCurrentDirectory(), $"wwwroot/Pictures/{registryName}-banner.jpg").Replace("\\", "/");
            if (!System.IO.File.Exists(profile))
                profile = null;
            else
                profile = $"Pictures/{registryName}-profile.jpg";
            if (!System.IO.File.Exists(banner))
                banner = null;
            else
                banner = $"Pictures/{registryName}-banner.jpg";
            var test = new
            {
                User = new
                {
                    user.RegistryName,
                    user.DisplayName,
                    user.Guid,
                    user.Description,
                    user.Email,
                    Likes = user.Likes.Count,
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
                Profile = profile,
                Banner = banner
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
            var user = _db.User.FirstOrDefault(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            return Ok(new
            {
                user.DisplayName,
                Username = user.RegistryName,
                user.Description,
                user.Email,
                user.Origin,
                user.FavDestination,
                user.Guid
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
                    user.SetPassword(userCmd.Password);
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
                try { await _db.SaveChangesAsync(); }
                catch (DbUpdateException e) { return BadRequest(e.Message); }
                return Ok();
            }
            var follower = new Follower(userSender, userRecipient, DateTime.UtcNow.Date);
            _db.Follower.Add(follower);
            try { await _db.SaveChangesAsync(); }
            catch (DbUpdateException e) { return BadRequest(e.Message); }
            return Ok();
        }

        /*[Authorize]
        [HttpPost("sendFriendRequest/{guid:Guid}")]
        public async Task<IActionResult> SendFriendRequest(Guid guid)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var username = HttpContext.User.Identity?.Name;
            var userSender = await _db.User.FirstOrDefaultAsync(u => u.RegistryName == username);
            if (userSender is null) { return Unauthorized(); }
            var userRecipient = await _db.User.FirstOrDefaultAsync(a => a.Guid == guid);
            if(userRecipient is null) { return BadRequest(); }
            if (await _db.FriendRequests.FirstOrDefaultAsync(a => a.Sender == userSender && a.Recipient == userRecipient) is not null)
                return BadRequest("Freund gibt es schon!");
            var friendRequest = new FriendRequest(userSender, userRecipient, DateTime.UtcNow.Date);
            _db.FriendRequests.Add(friendRequest);
            try { await _db.SaveChangesAsync(); }
            catch (DbUpdateException e) { return BadRequest(e.Message); }
            return Ok();
        }

        //response = accept or deny
        [Authorize]
        [HttpPost("responseFriendRequest/{guid:Guid}")]
        public async Task<IActionResult> ResponseFriendRequest(Guid guid, [FromQuery] string response)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            if(response is null) { return BadRequest("Falschen Response ausgewählt!"); }
            var username = HttpContext.User.Identity?.Name;
            var userRecipient = await _db.User.FirstOrDefaultAsync(u => u.RegistryName == username);
            if (userRecipient is null) { return Unauthorized(); }
            var userSender = await _db.User.FirstOrDefaultAsync(a => a.Guid == guid);
            if (userSender is null) { return BadRequest(); }
            var friendRequest = await _db.FriendRequests.FirstOrDefaultAsync(a => a.Sender == userSender && a.Recipient == userRecipient);
            if (friendRequest is null)
                return BadRequest("User hat keine Freundschaftsanfrage geschickt");
            if(response == "accept")
            {
                userRecipient.Friends.Add(userSender);
                userSender.Friends.Add(userRecipient);
                try
                {
                    await _db.SaveChangesAsync();
                }
                catch(DbUpdateException e) { return BadRequest(e.Message); }
                return Ok();
            }
            if(response == "deny")
            {
                var friend = await _db.FriendRequests.FirstOrDefaultAsync(a => a.Sender == userSender && a.Recipient == userRecipient);
                if (friend is null) { return BadRequest(); }
                _db.FriendRequests.Remove(friend);
                try
                {
                    await _db.SaveChangesAsync();
                }
                catch (DbUpdateException e) { return BadRequest(e.Message); }
                return Ok();
            }
            return BadRequest();
        }*/
    }
}
