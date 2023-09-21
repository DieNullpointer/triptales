using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace TripTales.Application.Model
{
    public class TripLocation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        public Guid Guid { get; set; }
        public string Coordinates { get; set; }
        public TripDay TripDay { get; set; }
        public List<string> Images { get; } = new();

        public TripLocation(TripDay tripDay, string coordinates)
        {
            TripDay = tripDay;
            Coordinates = coordinates;
        }

#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        protected TripLocation() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        
    }
}
