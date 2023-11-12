using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
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
        
        [HttpGet("{registryName}")]
        public async Task<IActionResult> GetUserByRegistryNameTest(string registryName)
        {
            var user = await _db.User.FirstOrDefaultAsync(u => u.RegistryName == registryName);
            if (user is null) return BadRequest("User gibt es nicht");
            string? profile = Path.Combine(Directory.GetCurrentDirectory(), $"Pictures/{registryName}-picture.jpg").Replace("\\", "/");
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
        public async Task<IActionResult> GetUserdata()
        {
            // No username is set in HttpContext? Should never occur because we added the
            // Authorize annotation. But the properties are nullable, so we have to
            // check.
            //var username = _authService.CurrentUser;
            var username = HttpContext?.User.Identity?.Name;
            if (username is null) { return Unauthorized(); }

            // Valid token, but no user match in the database (maybe deleted by an admin).


            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if (user is null) { return Unauthorized(); }
            return Ok(new
            {
                user.Email,
                user.DisplayName,
                user.RegistryName,
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserCredentialsCmd credentials)
        {
            var jwt = await _authService.Login(credentials.registryName, credentials.password);
            if (jwt is null) { return Unauthorized(); }
            // Return the token so the client can save this to send a bearer token in the
            // subsequent requests.
            return Ok(new
            {
                Username = _authService.CurrentUser,
                UserGuid = _authService.CurrentUserGuid,
                Token = jwt
            });
        }

        [Authorize]
        [HttpDelete("delete/{guid:Guid}")]
        public async Task<IActionResult> DeleteUser(Guid guid)
        {
            (bool success, string message) = await _repo.Delete(guid);
            if(success) { return Ok(); }
            return BadRequest(message);
        }

        [Authorize]
        [HttpPut("change")]
        public async Task<IActionResult> ChangeUser([FromBody] UserCmd userCmd)
        {
            var user = _mapper.Map<User>(userCmd);
            user.SetPassword(userCmd.Password);
            (bool success, string message) = await _repo.Update(user);
            if (success) return Ok();
            return BadRequest(message);
        }
    }
}
