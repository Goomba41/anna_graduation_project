
using AutoMapper;
using backend.DTOs;

namespace backend.Mappers
{
    public class FileMapper : Profile
    {
        public FileMapper()
        {
            CreateMap<Models.File, FileResponseDTO>()
            // .ForMember(
            //     dest => dest.ActionDate,
            //     opt => opt.MapFrom(src => string.Concat(src.ActionDate.ToString("o", CultureInfo.InvariantCulture), "Z"))
            // )
            .ReverseMap();
            CreateMap<Models.File, FileNonBinaryResponseDTO>()
            // .ForMember(
            //     dest => dest.ActionDate,
            //     opt => opt.MapFrom(src => string.Concat(src.ActionDate.ToString("o", CultureInfo.InvariantCulture), "Z"))
            // )
            .ReverseMap();
            CreateMap<Models.File, FileBinaryResponseDTO>()
            // .ForMember(
            //     dest => dest.ActionDate,
            //     opt => opt.MapFrom(src => string.Concat(src.ActionDate.ToString("o", CultureInfo.InvariantCulture), "Z"))
            // )
            .ReverseMap();
        }
    }
}
