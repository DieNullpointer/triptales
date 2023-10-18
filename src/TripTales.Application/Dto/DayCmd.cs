using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripTales.Application.Dto
{
    public record DayCmd
    (
        DateTime Date,
        string Title,
        string Text
    );
}
