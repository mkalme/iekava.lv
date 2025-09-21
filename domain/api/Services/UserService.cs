
using BCrypt.Net;

namespace YourApp.Services;

public class UserService : IUserService
{
    public async Task<bool> ValidateCredentialsAsync(string username, string password)
    {
        // Simulate database lookup with async operation
        await Task.Delay(100); // Simulate database delay
        
        // Demo credentials (in production, these would be hashed in database)
        var users = new Dictionary<string, string>
        {
            { "admin", BCrypt.Net.BCrypt.HashPassword("password123") },
            { "user", BCrypt.Net.BCrypt.HashPassword("mypassword") }
        };
        
        if (users.ContainsKey(username))
        {
            return BCrypt.Net.BCrypt.Verify(password, users[username]);
        }
        
        return false;
    }
}