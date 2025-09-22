namespace YourApp.Models;

public class LoginResponse
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
}