using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripTales.Application.Dto
{
    public record UserCmd
    (
        string Email,
        string Password,
        string DisplayName, 
        string RegistryName,
        string? Description,
        string? Origin,
        string? FavDestination
    ); 
}
