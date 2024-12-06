namespace backend.Models;

public partial class Material
{
    public int Id { get; set; }

    public DateTime ActionDate { get; set; } = DateTime.Now;

    public int? Number { get; set; } = null!;

    // TODO: сделать тип входящий исходящий
    // public int? Number { get; set; } = null!;

    public string? AdditionalInfo { get; set; } = null!;

    // TODO: связь с справочником
    public virtual DepartureType? DepartureType { get; set; }

    public DateTime? Control { get; set; } = null!;

    public DateTime? Fact { get; set; } = null!;

    // TODO: связь с справочником
    public virtual DocumentType? DocumentType { get; set; }

    // TODO: связь с справочником
    public virtual Project? Project { get; set; }

    // TODO: связь с справочником
    public virtual Institution? Institution { get; set; }

    // TODO: связь с справочником
    public virtual User? Creator { get; set; }

    /// <summary>
    /// Удален (не выводить)
    /// </summary>
    public bool Deleted { get; set; }
}
