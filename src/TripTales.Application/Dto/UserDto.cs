using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TripTales.Application.Dto
{
    public record UserDto
    (
        Guid guid,
        List<FriendDto>? Friends,
        List<PostDto>? Posts,
        List<FriendRequestDto>? FriendRequests,
        string DisplayName,
        string RegistryName,
        [EmailAddress]
        string Email,
        string Description,
        string Origin,
        string FavDestination
    );
}
