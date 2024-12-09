using System.Globalization;
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
            .ForMember(
                dest => dest.ActionDate,
                opt => opt.MapFrom(src => string.Concat(src.ActionDate.ToString("o", CultureInfo.InvariantCulture), "Z"))
            )
            .ReverseMap();
        }
    }
}
