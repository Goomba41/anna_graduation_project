namespace backend.DTOs
{
    public class FileResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Mime { get; set; } = "";
        public DateTime? Atime { get; set; }
        public DateTime? Mtime { get; set; }
        public DateTime Ctime { get; set; }
        public byte[]? Binary { get; set; }
        // public int MaterialId { get; set; }
        // public MaterialResponseDTO? Material { get; set; }
    }

    public class FileNonBinaryResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Mime { get; set; } = "";
        public DateTime? Atime { get; set; }
        public DateTime? Mtime { get; set; }
        public DateTime Ctime { get; set; }
        // public int MaterialId { get; set; }
        // public MaterialResponseDTO? Material { get; set; }
    }

    public class FileBinaryResponseDTO
    {
        public byte[]? Binary { get; set; }
    }
}
