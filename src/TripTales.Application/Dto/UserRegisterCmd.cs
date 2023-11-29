using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripTales.Application.Dto
{
    public record UserRegisterCmd
    (
        [EmailAddress]
        string email,
        string password,
        string displayName,
        string registryName,
        string? description
    );
}
