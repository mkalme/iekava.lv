using Microsoft.AspNetCore.Identity;

namespace YourApp.Entity;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public ICollection<Role> Roles { get; set; } = new List<Role>();

    public User(string username, string password, ICollection<Role> roles) 
    {
        Username = username;
        PasswordHash = new PasswordHasher<User>().HashPassword(user, password);
        Roles = roles;
    }
}