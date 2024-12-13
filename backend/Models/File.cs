namespace backend.Models;

public class File
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Mime { get; set; }

    public DateTime Atime { get; set; } = DateTime.Now;

    public DateTime Mtime { get; set; } = DateTime.Now;

    public required byte[] Binary { get; set; }

    // Связь с материалами
    public virtual Material? Material { get; set; }
    public int? MaterialId { get; set; }

    public bool Deleted { get; set; }
}
