using Microsoft.AspNetCore.Identity;

namespace YourApp.Entity;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public ICollection<Role> Roles { get; set; } = [];

    public User(){}

    public User(string username, string password, ICollection<Role> roles) 
    {
        Update(username, password);
        Roles = roles;
    }

    public void Update(string? username, string? password) 
    {
        if (!string.IsNullOrEmpty(username)) 
        {
            Username = username;
        }

        if (!string.IsNullOrEmpty(password)) 
        {
            PasswordHash = new PasswordHasher<User>().HashPassword(this, password);
        }
    }
}