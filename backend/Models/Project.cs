namespace backend.Models;

public partial class Project
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    /// <summary>
    /// Удален (не выводить)
    /// </summary>
    public bool Deleted { get; set; }
}
