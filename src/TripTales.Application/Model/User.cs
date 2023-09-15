using AutoMapper.Execution;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripTales.Application.Model
{
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(RegistryName), IsUnique = true)]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string DisplayName { get; set; }
        public string RegistryName { get; set; }
        public List<User> Friends { get; } = new();

        public User(string email, string password, string displayName, string registryName)
        {
            Email = email;
            Password = password;
            DisplayName = displayName;
            RegistryName = registryName;
        }
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        protected User() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
    }
}