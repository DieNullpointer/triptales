using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TripTales.Application.Model;

namespace TripTales.Application.Dto
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserRegisterCmd, User>(); //UserRegisterCmd --> User
            CreateMap<User, UserDto>(); //User --> UserDto
            CreateMap<TripPost, PostDto>();
            CreateMap<User, FriendDto>();
            CreateMap<UserCmd, User>();
            CreateMap<PostCmd, TripPost>();
            CreateMap<DayCmd, TripDay>();
        }
    }
}
