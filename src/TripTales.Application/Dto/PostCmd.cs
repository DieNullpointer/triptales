using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripTales.Application.Dto
{
    public record PostCmd
    (
        string Title,
        string Text,
        DateTime Begin,
        DateTime End,
        List<DayCmd> Days
    );
}
