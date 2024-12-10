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
            .ForMember(
                dest => dest.Fact,
                opt => opt.MapFrom(src => src.Fact.HasValue ? string.Concat(src.Fact.Value.ToString("o", CultureInfo.InvariantCulture), "Z") : null)
            )
            .ForMember(
                dest => dest.Control,
                opt => opt.MapFrom(src => src.Control.HasValue ? string.Concat(src.Control.Value.ToString("o", CultureInfo.InvariantCulture), "Z") : null)
            )
            .ReverseMap();
        }
    }
}
