namespace backend.DTOs
{
    public class InstitutionResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Address { get; set; } = "";
        public string Contact { get; set; } = "";
        public int Subject { get; set; }
        public int District { get; set; }
        public int Locality { get; set; }
        public string SubjectString { get; set; } = "";
        public string DistrictString { get; set; } = "";
        public string LocalityString { get; set; } = "";
    }
}
