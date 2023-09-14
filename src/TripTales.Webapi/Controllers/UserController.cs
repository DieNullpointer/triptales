using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using TripTales.Application.Infrastructure;
using TripTales.Application.Model;

namespace TripTales.Webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public readonly TripTalesContext _db;

        public UserController(TripTalesContext db)
        {
            _db = db;
        }


        public record UserRegisterCmd
        (
            [EmailAddress]
            string email,
            string password,
            string displayName,
            string registryName
        );
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterCmd user)
        {
            var user1 = new User(user.email, user.password, user.displayName, user.registryName);
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
        public IActionResult Get()
        {
            return Ok(_db.User.ToList());
        }
    }
}
