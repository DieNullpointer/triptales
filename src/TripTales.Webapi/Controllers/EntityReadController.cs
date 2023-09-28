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
    }
}
