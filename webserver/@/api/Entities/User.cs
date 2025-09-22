using Microsoft.AspNetCore.Identity;

namespace YourApp.Entity;

public class User : Entity
{
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public ICollection<Role> Roles { get; set; } = [];

    public User()
    {
        Username = string.Empty;
        PasswordHash = string.Empty;
    }

    public User(string username, string password, ICollection<Role> roles) : this()
    {
        Update(username, password, roles);
    }

    public void Update(string? username, string? password, ICollection<Role> roles)
    {
        if (!string.IsNullOrEmpty(username))
        {
            Username = username;
        }

        if (!string.IsNullOrEmpty(password))
        {
            PasswordHash = new PasswordHasher<User>().HashPassword(this, password);
        }

        if (roles is not null)
        {
            Roles.Clear();
            foreach (var role in roles)
            {
                Roles.Add(role);
            }
        }
    }
}