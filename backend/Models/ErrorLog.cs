using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class ErrorLog
{
    public Guid Id { get; set; }

    public DateTime Date { get; set; }

    public string Event { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Hostname { get; set; } = null!;

    public string Details { get; set; } = null!;

    public int? UserId { get; set; }

    public virtual User? User { get; set; }
}
