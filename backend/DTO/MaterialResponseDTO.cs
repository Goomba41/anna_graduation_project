using backend.Models;

namespace backend.DTOs
{
    public class MaterialResponseDTO
    {
        public int Id { get; set; }
        public DateTime ActionDate { get; set; } = DateTime.Now;
        public string Number { get; set; } = "";
        public MaterialType MaterialType { get; set; } = MaterialType.Incoming;
        public string? AdditionalInfo { get; set; } = null!;
        public int? DepartureTypeId { get; set; }
        public DateTime? Control { get; set; } = null!;
        public DateTime? Fact { get; set; } = null!;
        public int? DocumentTypeId { get; set; }
        public int? ProjectId { get; set; }
        public int? InstitutionId { get; set; }
        public int? CreatorId { get; set; }
        public bool Deleted { get; set; }
    }
}
