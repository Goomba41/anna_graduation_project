using System.ComponentModel.DataAnnotations;

namespace backend.Authorization;

public class LoginRequest
{
    [Required]
    public string Login { get; set; }

    [Required]
    public string Password { get; set; }

    public LoginRequest(string login, string password)
    {
        Login = login;
        Password = password;
    }
}
