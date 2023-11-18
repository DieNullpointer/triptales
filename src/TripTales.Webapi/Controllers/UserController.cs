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
                Friends = h.Friends.Select(f => new
                {
                    f.Guid,
                    f.DisplayName,
                    f.RegistryName
                }),
                FriendRequest = h.RequestFriend.Select(f => new
                {
                    f.Guid,
                    f.DisplayName,
                    f.RegistryName
                }),
                h.DisplayName,
                h.Email,
                h.RegistryName,
                h.Description,
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
            string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "Pictures");
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
        public async Task<IActionResult> GetUserByRegistryNameTest(string registryName)
        {
            var user = await _db.User.FirstOrDefaultAsync(u => u.RegistryName == registryName);
            if (user is null) return BadRequest("User gibt es nicht");
            string? profile = Path.Combine(Directory.GetCurrentDirectory(), $"Pictures/{registryName}-profile.jpg").Replace("\\", "/");
            string? banner = Path.Combine(Directory.GetCurrentDirectory(), $"Pictures/{registryName}-banner.jpg").Replace("\\", "/");
            if (!System.IO.File.Exists(profile))
                profile = null;
            if(!System.IO.File.Exists(banner))
                banner = null;
            var test = new
            {
                User = _mapper.Map<UserDto>(user),
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
            return Ok(new
            {
                Username = HttpContext.User.Identity?.Name,
                //IsAdmin = HttpContext.User.IsInRole("admin"),
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
            user = _mapper.Map<User>(userCmd);
            user.SetPassword(userCmd.Password);
            (bool success, string message) = await _repo.Update(user);
            if (success) return Ok();
            return BadRequest(message);
        }

        //User1 schickt Freundschaftsanfrage an User2
        //User2 bekommt User1 in List: RequestFriend
        [Authorize]
        [HttpPost("sendFriendRequest/{guid:Guid}")]
        public async Task<IActionResult> SendFriendRequest(Guid guid)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            var username = HttpContext.User.Identity?.Name;
            var user1 = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user1 is null) { return Unauthorized(); }
            var user2 = await _db.User.FirstOrDefaultAsync(a => a.Guid == guid);
            if(user2 is null) { return BadRequest("Gesuchte User gibt es nicht!"); }
            user2.RequestFriend.Add(user1);
            try { await _db.SaveChangesAsync(); }
            catch (DbUpdateException e) { return BadRequest(e.Message); }
            return Ok();
        }

        // api/user/sendFriendResponse?response=accept
        // api/user/sendFriendResponse?response = deny
        // User1 ist der annehmende User
        [Authorize]
        [HttpPost("sendFriendResponse/{guid:Guid}")]
        public async Task<IActionResult> FriendRequestResponse(Guid guid, [FromQuery] string response)
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) { return Unauthorized(); }
            if (response is null) return BadRequest("Response ist ein Pflichtfeld");
            var username = HttpContext.User.Identity?.Name;
            var user1 = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            var user2 = await _db.User.FirstOrDefaultAsync(a => a.Guid == guid);
            if (user1 is null) { return Unauthorized(); }
            if (user2 is null) { return BadRequest("Gesuchte User gibt es nicht!"); }
            if (user1.RequestFriend.Count == 0 || !user1.RequestFriend.Contains(user2))
                return BadRequest("Dieser Freund hat keine Freundschaftsanfrage geschickt");
            if (response == "accept")
            {
                user1.RequestFriend.Remove(user2);
                user2.RequestFriend.Remove(user1);
                user2.Friends.Add(user1);
                user1.Friends.Add(user2);
                try { await _db.SaveChangesAsync(); }
                catch (DbUpdateException e) { return BadRequest(e.Message); }
                return Ok();
            }
            else if(response == "deny")
            {
                user1.RequestFriend.Remove(user2);
                user2.RequestFriend.Remove(user1);
                try { await _db.SaveChangesAsync(); }
                catch(DbUpdateException e) { return  BadRequest(e.Message); }
                return Ok();
            }
            return BadRequest("Falscher Response Type");
        }
    }
}
