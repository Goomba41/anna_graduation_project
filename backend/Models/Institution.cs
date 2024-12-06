namespace backend.Models;

public partial class Institution
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    public string Address { get; set; } = "";

    public string? Contact { get; set; } = null!;

    public int Subject { get; set; }

    public string SubjectString { get; set; } = "";

    public int District { get; set; }

    public string DistrictString { get; set; } = "";

    public int Locality { get; set; }

    public string LocalityString { get; set; } = "";

    /// <summary>
    /// Удален (не выводить)
    /// </summary>
    public bool Deleted { get; set; }

    public virtual ICollection<Material> Materials { get; set; } = new List<Material>();
}
