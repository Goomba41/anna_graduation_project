namespace backend.Models;

public partial class DocumentType
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    /// <summary>
    /// Удален (не выводить)
    /// </summary>
    public bool Deleted { get; set; }

    public virtual ICollection<Material> Materials { get; set; } = new List<Material>();
}
