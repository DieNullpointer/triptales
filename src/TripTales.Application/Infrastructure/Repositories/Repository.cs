using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TripTales.Application.Model;

namespace TripTales.Application.Infrastructure.Repositories
{
    public abstract class Repository<Tentity, Tkey> where Tentity : class,
        IEntity<Tkey> where Tkey : struct
    {
        protected readonly TripTalesContext _db;

        protected Repository(TripTalesContext db)
        {
            _db = db;
        }

        public IQueryable<Tentity> Set => _db.Set<Tentity>().AsQueryable();
        public IModel Model => _db.Model;
        public virtual async Task<(bool success, string message)> Insert(Tentity entity)
        {
            _db.Set<Tentity>().Add(entity);
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                return (false, e.InnerException?.Message ?? e.Message);
            }
            return (true, string.Empty);
        }

        public virtual async Task<(bool success, string message)> Update(Tentity entity)
        {
            // Check if entity exists in our database.
            if (!HasPrimaryKey(entity)) { return (false, "Missing primary key."); }

            _db.Entry(entity).State = EntityState.Modified;
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return (false, ex.InnerException?.Message ?? ex.Message);
            }
            return (true, string.Empty);
        }
        public virtual async Task<(bool success, string message)> Delete(Guid guid)
        {
            var entity = await _db.Set<Tentity>().FirstOrDefaultAsync(e => e.Guid.Equals(guid));
            if (entity is null) { return (false, "Entity not found."); }
            return await Delete(entity);
        }
        public virtual async Task<(bool success, string message)> Delete(Tkey key)
        {
            var entity = await _db.Set<Tentity>().FirstOrDefaultAsync(e => e.Id.Equals(key));
            if (entity is null) { return (false, "Entity not found."); }
            return await Delete(entity);
        }

        private async Task<(bool success, string message)> Delete(Tentity entity)
        {
            // Check if entity exists in our database.
            if (!HasPrimaryKey(entity)) { return (false, "Missing primary key."); }
            _db.Set<Tentity>().Remove(entity);
            try
            {
                await System.Threading.Tasks.Task.CompletedTask;
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                return (false, e.InnerException?.Message ?? e.Message);
            }
            return (true, string.Empty);
        }

        private bool HasPrimaryKey(Tentity entity) => !entity.Id.Equals(default);
    }
}
