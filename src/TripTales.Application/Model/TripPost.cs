using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripTales.Application.Model
{
    public class TripPost: IEntity<int>
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public DateTime Created { get; set; }
        public DateTime Begin { get; set; }
        public DateTime End { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public User? User { get; set; }
        public List<TripDay> Days { get; } = new();
        public List<User> Likes { get; } = new();
        public List<Comment> Comments { get; } = new();
        public List<PostImages> Images { get; } = new();

        public TripPost(string title, string text, DateTime begin, DateTime end, User user)
        {
            Title = title;
            Text = text;
            Created = DateTime.UtcNow;
            Begin = begin;
            End = end;
            User = user;
        }

#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        protected TripPost() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

    }
}
