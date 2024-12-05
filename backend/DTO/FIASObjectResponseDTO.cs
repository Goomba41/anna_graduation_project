namespace backend.DTOs
{
    public class FIASObjectDTO
    {
        public int ObjectId { get; set; }
        public int? PostalCode { get; set; } = null!;
        public string? Okato { get; set; } = null!;
        public string? Oktmo { get; set; } = null!;
        public string? KladrCode { get; set; } = null!;
        public string? OktmoBudget { get; set; } = null!;
        public Guid ObjectGuid { get; set; }
        public string FullName { get; set; } = "";
        public int RegionCode { get; set; }
        public bool IsActive { get; set; }
        public string Path { get; set; } = "";
    }
}
