using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripTales.Application.Model
{
    public class Comment
    {
        public Comment(User user, string text, DateTime created, TripPost post)
        {
            User = user;
            Text = text;
            Created = created;
            Post = post;
        }

#pragma warning disable CS8618
        protected Comment() { }
#pragma warning restore CS8618

        public int Id { get; set; }
        public Guid Guid { get; set; }
        public User User { get; set; }
        public string Text { get; set; }
        public DateTime Created { get; set; }
        public TripPost Post { get; set; }
    }
}
