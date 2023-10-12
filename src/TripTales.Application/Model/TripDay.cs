using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripTales.Application.Model
{
    public class TripDay : IEntity<int>
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public Guid Guid { get; set; }  
        public DateTime Date { get; set; }
        public string Title { get; set; }   
        public string Text { get; set; }
        public TripPost Post { get; set; }
        public List<string> Images { get; } = new();
        public List<TripLocation> Locations { get; } = new();

        public TripDay(DateTime date, string title, string text, TripPost post)
        {
            Date = date;
            Title = title;
            Text = text;
            Post = post;
        }

#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        protected TripDay() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
    }
}
