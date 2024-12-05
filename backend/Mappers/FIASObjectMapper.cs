using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappers
{
    public class FIASObjectMapper : Profile
    {
        public FIASObjectMapper()
        {
            CreateMap<FIASObject, FIASObjectDTO>()
            .ForMember(
                dest => dest.ObjectId,
                opt => opt.MapFrom(src => src.object_id)
            )
            .ForMember(
                dest => dest.PostalCode,
                opt => opt.MapFrom(src => src.address_details.postal_code)
            )
            .ForMember(
                dest => dest.Okato,
                opt => opt.MapFrom(src => src.address_details.okato)
            )
            .ForMember(
                dest => dest.Oktmo,
                opt => opt.MapFrom(src => src.address_details.oktmo)
            )
            .ForMember(
                dest => dest.KladrCode,
                opt => opt.MapFrom(src => src.address_details.kladr_code)
            )
            .ForMember(
                dest => dest.OktmoBudget,
                opt => opt.MapFrom(src => src.address_details.oktmo_budget)
            )
            .ForMember(
                dest => dest.ObjectGuid,
                opt => opt.MapFrom(src => src.object_guid)
            )
            .ForMember(
                dest => dest.FullName,
                // opt => opt.MapFrom(src => $"{(src.region_code < 10 ? 0 : "")}{src.region_code} • {src.full_name}")
                opt => opt.MapFrom(src => GenerateFullName(src))
            )
            .ForMember(
                dest => dest.RegionCode,
                opt => opt.MapFrom(src => src.region_code)
            )
            .ForMember(
                dest => dest.IsActive,
                opt => opt.MapFrom(src => src.is_active)
            )
            .ForMember(
                dest => dest.Path,
                opt => opt.MapFrom(src => src.path)
            )
            .ReverseMap();
        }

        public string GenerateFullName(FIASObject src)
        {
            if (src.object_level_id == 1)
                return $"{(src.region_code < 10 ? 0 : "")}{src.region_code} • {src.full_name}";

            if ((new[] { 2, 3, 4, 5, 6 }).Contains(src.object_level_id))
            {
                FIASHierarchyObject? hierarchyObject = src.hierarchy.FirstOrDefault(ho =>
                  ho.object_id == src.object_id && ho.object_level_id == src.object_level_id
                );

                if (hierarchyObject != null)
                    return hierarchyObject.full_name;

                return src.full_name;
            }

            return src.full_name;
        }
    }
}
