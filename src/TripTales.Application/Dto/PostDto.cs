using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TripTales.Application.Model;

namespace TripTales.Application.Dto
{
    public record PostDto
    (
        Guid Guid,
        DateTime Created,
        string Title,
        string Text
    );
}
