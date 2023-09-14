using AutoMapper.Execution;
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
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        private Guid Guid { get; set; }
        private string Email { get; set; }
        private string Password { get; set; }
        private string DisplayName { get; set; }
        private string RegistryName { get; set; }
        private List<User> Friends { get; } = new();

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