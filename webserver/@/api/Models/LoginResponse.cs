namespace YourApp.Models;

public class LoginResponse
{
    public string Message { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
}