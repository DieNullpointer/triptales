using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripTales.Application.Dto
{
    public record UserCmd
    (
        Guid guid,
        string Email,
        string Password,
        string DisplayName, 
        string RegistryName,
        string Description
    ); 
}
