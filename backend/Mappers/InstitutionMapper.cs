using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappers
{
    public class InstitutionMapper : Profile
    {
        public InstitutionMapper()
        {
            CreateMap<Institution, InstitutionResponseDTO>()
            // .ForMember(
            //     dest => dest.FullName,
            //     opt => opt.MapFrom(src => $"{src.LastName} {src.FirstName} {src.Patronymic}".Trim())
            // )
            .ReverseMap();
        }
    }
}
