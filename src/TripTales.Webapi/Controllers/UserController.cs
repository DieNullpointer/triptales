using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using TripTales.Application.Dto;
using TripTales.Application.Infrastructure;
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

        public UserController(TripTalesContext db, IMapper mapper, AuthService authService) : base(db, mapper)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterCmd user)
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
                Posts = h.Posts.Select(p => new
                {
                    p.Guid
                }),
                h.PasswordHash
            });

        [HttpGet("{guid}")]
        public async Task<IActionResult> GetUser(Guid guid) => await GetByGuid<UserDto>(guid);

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
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteUser(Guid guid)
        {
            var User = await _db.User.FirstOrDefaultAsync(a => a.Guid == guid);

            if (User is null) { return NotFound(); }

            _db.User.Remove(User);
            try { await _db.SaveChangesAsync(); }
            catch (DbUpdateException) { return BadRequest(); }
            return Ok();
        }
    }
}
