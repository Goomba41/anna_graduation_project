namespace backend.Authorization;

public class LoginResponse
{
    public string AccessToken { get; set; }

    public LoginResponse(string token)
    {
        AccessToken = token;
    }
}
