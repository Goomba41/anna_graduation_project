namespace backend.Models;

public partial class User
{
    public int Id { get; set; }

    public bool Sysadmin { get; set; }

    public string Login { get; set; } = null!;

    public string? LastName { get; set; }

    public string? FirstName { get; set; }

    public string? Patronymic { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    /// <summary>
    /// Удален (не выводить)
    /// </summary>
    public bool Deleted { get; set; }

    public virtual ICollection<ErrorLog> ErrorLogs { get; set; } = new List<ErrorLog>();

    public virtual ICollection<UsersActivity> UsersActivities { get; set; } = new List<UsersActivity>();
}
