using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
