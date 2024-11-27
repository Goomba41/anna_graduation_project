using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class UsersActivity
{
    public int Id { get; set; }

    public int Userid { get; set; }

    public string Action { get; set; } = null!;

    public DateTime Actiondate { get; set; }

    public string Description { get; set; } = null!;

    public int? EntityId { get; set; }

    public string? EntityRowId { get; set; }

    public virtual User User { get; set; } = null!;
}
