using backend.Models;

namespace backend.DTOs
{
    public class MaterialResponseDTO
    {
        public int Id { get; set; }
        public DateTime ActionDate { get; set; } = DateTime.Now;
        public string Number { get; set; } = "";
        public MaterialType MaterialType { get; set; } = MaterialType.Incoming;
        public string MaterialTypeName { get; set; } = "";
        public string? AdditionalInfo { get; set; } = null!;
        public DateTime? Control { get; set; } = null!;
        public DateTime? Fact { get; set; } = null!;

        public int? DepartureTypeId { get; set; }
        public StaticHandbookDTO? DepartureType { get; set; }
        public int? DocumentTypeId { get; set; }
        public StaticHandbookDTO? DocumentType { get; set; }
        public int? ProjectId { get; set; }
        public StaticHandbookDTO? Project { get; set; }
        public int? InstitutionId { get; set; }
        public InstitutionResponseDTO? Institution { get; set; }
        public int? CreatorId { get; set; }
        public UserResponseDTO? Creator { get; set; }

        public bool Deleted { get; set; }
    }
}
