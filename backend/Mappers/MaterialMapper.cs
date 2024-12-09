using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappers
{
    public class MaterialMapper : Profile
    {
        public MaterialMapper()
        {
            CreateMap<Material, MaterialResponseDTO>()
            // .ForMember(
            //     dest => dest.FullName,
            //     opt => opt.MapFrom(src => $"{src.LastName} {src.FirstName} {src.Patronymic}".Trim())
            // )
            .ReverseMap();
        }
    }
}
