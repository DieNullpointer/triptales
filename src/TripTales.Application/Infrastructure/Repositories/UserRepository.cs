using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TripTales.Application.Model;

namespace TripTales.Application.Infrastructure.Repositories
{
    public class UserRepository : Repository<User, int>
    {
        public UserRepository(TripTalesContext db) : base(db) { }

        public override async Task<(bool success, string message)> Delete(Guid guid)
        {
            var list = await _db.Posts.Include(a => a.User).Where(a => a.User!.Guid == guid).ToListAsync();
            foreach (var item in list)
            {
                item.User = null;
            }
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                return (false, e.InnerException?.Message ?? e.Message);
            }
            var entity = await _db.User.Include(a => a.Likes).Include(a => a.Posts).FirstOrDefaultAsync(a => a.Guid == guid);
            if (entity is null) { return (false, "User not found"); }
            return await base.Delete(guid);
        }

        public override async Task<(bool success, string message)> Update(User user)
        {
            var user2 = await _db.User.FirstOrDefaultAsync(a => a.Guid == user.Guid);
            if(user2 is null) { return (false, "User not found"); }
            user2.Email = user.Email;
            user2.DisplayName = user.DisplayName;
            user2.RegistryName = user.RegistryName;
            user2.Salt = user.Salt;
            user2.PasswordHash = user.PasswordHash;
            user2.Description = user.Description;
            user2.Origin = user.Origin;
            user2.FavDestination = user.FavDestination;
            return await base.Update(user2);
        }
    }
}
