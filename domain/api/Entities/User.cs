using Microsoft.AspNetCore.Identity;

namespace YourApp.Entity;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public ICollection<Role> Roles { get; set; } = [];

    public User(string username, string password, ICollection<Role> roles) 
    {
        Username = username;
        PasswordHash = new PasswordHasher<User>().HashPassword(this, password);
        Roles = roles;
    }
}