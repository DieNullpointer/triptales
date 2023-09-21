using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TripTales.Application.Infrastructure;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace TripTales.Application.Services
{
    public class AuthService
    {
        private readonly IConfiguration _config;
        private readonly TripTalesContext _db;

        public AuthService(IConfiguration config, TripTalesContext db)
        {
            _config = config;
            _db = db;
        }

        public string? CurrentUser { get; set; }
        public Guid? CurrentUserGuid { get; set; }

        public async Task<string?> Login(string username, string password)
        {
            var secret = Convert.FromBase64String(_config["Secret"]);
            var lifetime = TimeSpan.FromHours(3);

            var user = await _db.User.FirstOrDefaultAsync(a => a.RegistryName == username);
            if(user is null) { return null; }
            if(!user.CheckPassword(password)) { return null; }

            CurrentUser = user.RegistryName;
            CurrentUserGuid = user.Guid;

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.RegistryName.ToString()),
                    new Claim("Guid", user.Guid.ToString())
                }),
                Expires = DateTime.UtcNow + lifetime,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(secret),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
