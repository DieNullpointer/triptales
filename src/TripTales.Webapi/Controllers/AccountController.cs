using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using System.Collections.Generic;
using System.Diagnostics;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Logging;
using TripTales.Webapi.Services;
using System.Linq;

namespace TripTales.Webapi.Controllers
{
    [AllowAnonymous]
    [Route("[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AzureAdClient _adClient;
        private readonly ILogger<AccountController> _logger;

        public AccountController(AzureAdClient adClient, ILogger<AccountController> logger)
        {
            _adClient = adClient;
            _logger = logger;
        }


        /// <summary>
        /// Redirect to login.microsoft.com
        /// </summary>
        [HttpGet("signin")]
        public IActionResult Login([FromQuery] string? returnUrl)
        {
            return Redirect(_adClient.GetLoginUrl());
        }

        [HttpGet("authorize")]
        public async Task<IActionResult> Authorize([FromQuery] string code)
        {
            var (authToken, refreshToken) = await _adClient.GetToken(code);
            _logger.LogInformation(authToken);
            var graph = _adClient.GetGraphServiceClientFromToken(authToken);
            var me = await graph.Me.Request().GetAsync();
            await _adClient.AddOrUpdateUser(email: me.Mail, refreshToken: refreshToken);
            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, me.Mail.Split("@").First()),
                    //new Claim("Userdata", JsonSerializer.Serialize(currentUser)),
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
            return Redirect("/");
        }

        [HttpGet("signout")]
        public async Task<IActionResult> Signout()
        {
            await HttpContext.SignOutAsync();
            return Redirect(_adClient.GetLogoutUrl());
        }
    }
}
