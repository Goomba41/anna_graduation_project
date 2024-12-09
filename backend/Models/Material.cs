namespace backend.Models;

public enum MaterialType
{
    Incoming,
    Outgoing
}

public partial class Material
{
    public int Id { get; set; }

    public DateTime ActionDate { get; set; } = DateTime.Now;

    public string Number { get; set; } = "";

    public MaterialType MaterialType { get; set; } = MaterialType.Incoming;

    public string? AdditionalInfo { get; set; } = null!;

    // TODO: связь с справочником
    public virtual DepartureType? DepartureType { get; set; }
    public int? DepartureTypeId { get; set; }

    public DateTime? Control { get; set; } = null!;

    public DateTime? Fact { get; set; } = null!;

    // TODO: связь с справочником
    public virtual DocumentType? DocumentType { get; set; }
    public int? DocumentTypeId { get; set; }

    // TODO: связь с справочником
    public virtual Project? Project { get; set; }
    public int? ProjectId { get; set; }

    // TODO: связь с справочником
    public virtual Institution? Institution { get; set; }
    public int? InstitutionId { get; set; }

    // TODO: связь с справочником
    public virtual User? Creator { get; set; }
    public int? CreatorId { get; set; }

    /// <summary>
    /// Удален (не выводить)
    /// </summary>
    public bool Deleted { get; set; }
}
