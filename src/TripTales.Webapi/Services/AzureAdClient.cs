using Microsoft.Graph;
using System.IO;
using System.Net.Http;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System;
using System.Text;
using TripTales.Application.Infrastructure;
using TripTales.Application.Model;
using System.Linq;

namespace TripTales.Webapi.Services
{
    public class AzureAdClient
    {
        private readonly string _tenantId;
        private readonly string _clientId;
        private readonly string _redirectUrl;
        private readonly string _clientSecret;
        private readonly string _scope;
        private readonly byte[] _secret;
        private readonly TripTalesContext _db;

        public AzureAdClient(string tenantId, string clientId, string redirectUrl, string clientSecret, string scope, string secret, TripTalesContext db)
        {
            _tenantId = tenantId;
            _clientId = clientId;
            _redirectUrl = redirectUrl;
            _clientSecret = clientSecret;
            _scope = scope;
            _secret = Convert.FromBase64String(secret);
            _db = db;
        }

        public string GetLoginUrl()
        {
            return $"https://login.microsoftonline.com/{_tenantId}/oauth2/v2.0/authorize?client_id={_clientId}&response_type=code&redirect_uri={HttpUtility.UrlEncode(_redirectUrl)}&prompt=select_account&response_mode=query&scope={_scope}";
        }

        public string GetLogoutUrl()
        {
            return $"https://login.microsoftonline.com/{_tenantId}/oauth2/v2.0/logout";
        }

        public async Task<(string authToken, string refreshToken)> GetToken(string code)
        {
            var formdata = $"client_id={_clientId}&scope={_scope}&code={code}&redirect_uri={_redirectUrl}&grant_type=authorization_code&client_secret={_clientSecret}";
            var (authToken, refreshToken) = await RequestTokens(formdata);
            if (string.IsNullOrEmpty(refreshToken)) throw new ServiceException($"No refresh token provided. Please check offline_access in your scope.");
            return (authToken, refreshToken);
        }

        public async Task<string> GetNewToken(string username)
        {
            var user = _db.User.FirstOrDefault(u => u.Email == username) ?? throw new ServiceException($"User {username} not found.");
            if(user.RefreshToken is null) throw new ServiceException($"No refresh token for {username} provided.");
            var token = DecryptToken(user.RefreshToken);
            var formdata = $"client_id={_clientId}&scope={_scope}&refresh_token={token}&grant_type=refresh_token&client_secret={_clientSecret}";
            var (authToken, refreshToken) = await RequestTokens(formdata);
            if (string.IsNullOrEmpty(refreshToken)) throw new ServiceException($"No refresh token for {username} provided.");
            user.RefreshToken = EncryptToken(refreshToken);
            _db.SaveChanges();
            return authToken;
        }

        public Microsoft.Graph.GraphServiceClient GetGraphServiceClientFromToken(string token)
        {
            var authProvider = new Microsoft.Graph.DelegateAuthenticationProvider(request =>
            {
                request.Headers.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("bearer", token);
                return System.Threading.Tasks.Task.CompletedTask;
            });

            return new Microsoft.Graph.GraphServiceClient(authProvider);
        }

        public async System.Threading.Tasks.Task AddOrUpdateUser(string email, string refreshToken)
        {
            var token = EncryptToken(refreshToken);
            var user = _db.User.FirstOrDefault(u => u.Email == email);
            if (user is null)
            {
                user = new TripTales.Application.Model.User(email, email.Split("@").First(), token);
                _db.User.Add(user);
            }
            else
                user.RefreshToken = token;
            await _db.SaveChangesAsync();
        }

        /// <summary>
        /// Set the account to send alert emails and encrypt the refresh token with the key provided.
        /// </summary>
        private string EncryptToken(string refreshToken)
        {
            using var aes = Aes.Create();
            aes.Key = _secret;

            var value = Encoding.UTF8.GetBytes(refreshToken);
            using var memoryStream = new MemoryStream();
            memoryStream.Write(aes.IV);
            using var encryptor = aes.CreateEncryptor();
            using (var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                cryptoStream.Write(value);
            var encryptedToken = Convert.ToBase64String(memoryStream.ToArray());
            return encryptedToken;
        }

        /// <summary>
        /// Read the account to send alert emails and decrypt the refresh token with the key provided.
        /// </summary>
        private string DecryptToken(string enctyptedToken)
        {
            using var aes = Aes.Create();
            var memoryStream = new MemoryStream(Convert.FromBase64String(enctyptedToken));
            var iv = new byte[aes.BlockSize / 8];
            memoryStream.Read(iv);

            using var decryptor = aes.CreateDecryptor(_secret, iv);
            using var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
            using var dataStream = new MemoryStream();
            cryptoStream.CopyTo(dataStream);
            return Encoding.UTF8.GetString(dataStream.ToArray());
        }

        private async Task<(string authToken, string? refreshToken)> RequestTokens(string formdata)
        {
            using var client = new HttpClient();
            client.BaseAddress = new Uri($"https://login.microsoftonline.com/{_tenantId}/oauth2/v2.0/");
            var response = await client.PostAsync("token", new StringContent(formdata, Encoding.UTF8, "application/x-www-form-urlencoded"));
            var content = await response.Content.ReadAsStringAsync();
            if (!response.IsSuccessStatusCode) { throw new ApplicationException(content); }

            var data = System.Text.Json.JsonDocument.Parse(content).RootElement;
            var authToken = data.GetProperty("access_token").GetString()
                ?? throw new ServiceException("Missing auth token in response.");
            var refreshToken = data.TryGetProperty("refresh_token", out var val)
                ? val.GetString() : null;
            return (authToken, refreshToken);
        }
    }
}
