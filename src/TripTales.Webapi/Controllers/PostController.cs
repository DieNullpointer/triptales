using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using TripTales.Application.Infrastructure;
using TripTales.Application.Model;

namespace TripTales.Webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : EntityReadController<TripPost>
    {
        public PostController(TripTalesContext db, IMapper mapper) : base(db, mapper)
        {
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPosts() => await GetAll(h =>
            new
            {
                h.Guid,
                h.Begin,
                h.End,
                h.Title,
                h.Text,
                h.Created,
                Likes = h.Likes.Count,
                Days = h.Days.Select(d => new
                {
                    d.Title,
                    d.Text,
                    d.Date,
                    d.Images,
                    Locations = d.Locations.Select(l => new
                    {
                        l.Coordinates,
                        l.Images
                    })
                }),
                User = new
                {
                    h.User!.Guid,
                    h.User!.RegistryName,
                    h.User!.DisplayName
                }
            });

        [HttpGet("{guid:Guid}")]
        public async Task<IActionResult> GetPost(Guid guid) => await GetByGuid(guid, h =>
            new
            {
                h.Guid,
                h.Begin,
                h.End,
                h.Title,
                h.Text,
                h.Created,
                Likes = h.Likes.Count,
                Days = h.Days.Select(d => new
                {
                    d.Title,
                    d.Text,
                    d.Date,
                    d.Images,
                    Locations = d.Locations.Select(l => new
                    {
                        l.Coordinates,
                        l.Images
                    })
                }),
                User = new
                {
                    h.User!.Guid,
                    h.User!.RegistryName,
                    h.User!.DisplayName
                }
            });
    }
}
