using System;
using System.ComponentModel.DataAnnotations;

namespace TripTales.Application.Dto
{
    public record FriendDto
    (
        Guid guid,
        string DisplayName,
        string RegistryName,
        [EmailAddress]
        string Email
    );
}
