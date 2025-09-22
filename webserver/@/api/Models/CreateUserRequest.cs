namespace YourApp.Models;

public class CreateUserRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public ICollection<string> Roles { get; set; } = [];
}