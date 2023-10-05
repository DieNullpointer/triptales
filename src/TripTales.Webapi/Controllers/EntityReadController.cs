using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;
using System.Linq;
using System.Threading.Tasks;
using System;
using TripTales.Application.Infrastructure;
using TripTales.Application.Model;
using Microsoft.EntityFrameworkCore;

namespace TripTales.Webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntityReadController<TEntity> : ControllerBase where TEntity : class, IEntity
    {
        protected readonly TripTalesContext _db;
        protected readonly IMapper _mapper;

        public EntityReadController(TripTalesContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        protected async Task<IActionResult> GetAll<TDto>(Expression<Func<TEntity, TDto>> projection)
        {
            var result = await _db.Set<TEntity>()
                .Select(projection)
                .ToListAsync();
            return Ok(result);
        }

        protected IQueryable<TEntity> ExpandQueryByParam(IQueryable<TEntity> query)
        {
            // Suche z. B. den Entity Type Handin
            var entity = _db.Model.FindEntityType(typeof(TEntity));
            if (entity is null) { throw new ApplicationException($"Entity {typeof(TEntity).Name} not found."); }

            // HTTP Request im Controller analysiere die Parameter
            // $expand=Student,Task soll ausgelesen werden.
            if (!HttpContext.Request.Query.TryGetValue("$expand", out var paramValues))
                return query;
            // values wäre dann [Student, Task]
            var values = paramValues.SelectMany(v => v.Split(",")).ToList();

            var expandNavigations = entity.GetNavigations()
                .Where(n => values.Contains(n.Name) || values.Contains(n.Name.ToLower())).Select(n => n.Name);
            foreach (var navigation in expandNavigations)
                query = query.Include(navigation);                // _db.Set<Handin>().Include(h=>h.Student)
            return query;
        }
    }
}
