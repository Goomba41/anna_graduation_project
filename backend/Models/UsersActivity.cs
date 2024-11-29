namespace backend.Models;

public partial class UsersActivity
{
    public int Id { get; set; }

    public int? Userid { get; set; }

    public string Action { get; set; } = null!;

    public DateTime? Actiondate { get; set; }

    public virtual User? User { get; set; }
}
