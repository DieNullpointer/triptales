using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TripTales.Application.Model;

namespace TripTales.Application.Infrastructure.Repositories
{
    public class PostRepository : Repository<TripPost, int>
    {
        public PostRepository(TripTalesContext db) : base(db) { }
    }
}
