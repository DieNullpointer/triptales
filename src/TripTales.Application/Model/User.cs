using AutoMapper.Execution;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripTales.Application.Model
{
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(RegistryName), IsUnique = true)]
    public class User : IEntity<int>
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public string Email { get; set; }
        public string Salt { get; set; }
        public string PasswordHash { get; set; }
        public string? DisplayName { get; set; }
        public string RegistryName { get; set; }
        public string? Description { get; set; }
        //where the user is from
        public string? Origin { get; set; }
        public string? FavDestination { get; set; }
        public string? ResetToken { get; set; }
        public string? ProfilePicture { get; set; }
        public string? BannerPicture { get; set; }
        public List<Follower> FollowerSender { get; } = new();
        public List<Follower> FollowerRecipient { get; } = new();
        public List<TripPost> Posts { get; } = new();
        public List<TripPost> Likes { get; } = new();
        public List<Notification> Notifications { get; } = new();
        public List<Notification> NotificationSender { get; } = new();
        public User(string email, string password, string registryName, string? displayName = null, string? description = null, string? origin = null, string? favDestination = null)
        {
            Email = email;
            SetPassword(password);
            DisplayName = displayName;
            RegistryName = registryName;
            Description = description;
            Origin = origin;
            FavDestination = favDestination;
            ResetToken = null;
        }
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        protected User() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

        // Hint for the compiler that we initialize some properties in this method.
        [MemberNotNull(nameof(Salt), nameof(PasswordHash))]
        public void SetPassword(string password)
        {
            Salt = GenerateRandomSalt();
            PasswordHash = CalculateHash(password, Salt);
        }
        public bool CheckPassword(string password) => PasswordHash == CalculateHash(password, Salt);
        /// <summary>
        /// Generates a random number with the given length of bits.
        /// </summary>
        /// <param name="length">Default: 128 bits (16 Bytes)</param>
        /// <returns>A base64 encoded string from the byte array.</returns>
        private string GenerateRandomSalt(int length = 128)
        {
            byte[] salt = new byte[length / 8];
            using (System.Security.Cryptography.RandomNumberGenerator rnd =
                System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                rnd.GetBytes(salt);
            }
            return Convert.ToBase64String(salt);
        }

        /// <summary>
        /// Calculates a HMACSHA256 hash value with a given salt.
        /// <returns>Base64 encoded hash.</returns>
        private string CalculateHash(string password, string salt)
        {
            byte[] saltBytes = Convert.FromBase64String(salt);
            byte[] passwordBytes = System.Text.Encoding.UTF8.GetBytes(password);

            System.Security.Cryptography.HMACSHA256 myHash =
                new System.Security.Cryptography.HMACSHA256(saltBytes);

            byte[] hashedData = myHash.ComputeHash(passwordBytes);

            // Das Bytearray wird als Hexstring zurückgegeben.
            return Convert.ToBase64String(hashedData);
        }
    }
}