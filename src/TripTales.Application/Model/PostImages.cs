using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripTales.Application.Model
{
    public class PostImages
    {
        public PostImages(string path, TripPost post)
        {
            Path = path;
            Post = post;
        }

#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        protected PostImages() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

        public int Id { get; set; }
        public string Path { get; set; }
        public TripPost Post { get; set; }
    }
}
