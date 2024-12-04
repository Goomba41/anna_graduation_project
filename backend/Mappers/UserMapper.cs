using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappers
{
    public class UserMapper : Profile
    {
        public UserMapper()
        {
            CreateMap<User, UserResponseDTO>()
            .ForMember(
                dest => dest.FullName,
                opt => opt.MapFrom(src => $"{src.LastName} {src.FirstName} {src.Patronymic}".Trim())
            )
            .ReverseMap();
        }
    }
}
