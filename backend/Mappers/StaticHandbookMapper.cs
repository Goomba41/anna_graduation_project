using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappers
{
    public class StaticHandbookMapper : Profile
    {
        public StaticHandbookMapper()
        {
            CreateMap<DepartureType, StaticHandbookDTO>()
            // .ForMember(
            //     dest => dest.FullName,
            //     opt => opt.MapFrom(src => $"{src.LastName} {src.FirstName} {src.Patronymic}".Trim())
            // )
            .ReverseMap();
            CreateMap<DocumentType, StaticHandbookDTO>().ReverseMap();
            CreateMap<Project, StaticHandbookDTO>().ReverseMap();
            CreateMap<Institution, StaticHandbookDTO>().ReverseMap();
        }
    }
}
