using YourApp.Entity;

namespace YourApp.Models;

public class UpdateUserRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public ICollection<Role> Roles { get; set; } = [];
}