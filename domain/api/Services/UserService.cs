
using Microsoft.AspNetCore.Identity;
using YourApp.Entity;

namespace YourApp.Services;

public class UserService(AppDbContext _dbContext) : IUserService
{
    public async Task<bool> ValidateCredentialsAsync(string username, string password)
    {
        var user = await GetUserByUsernameAsync(username);
        if (user is null) return false;

        var passwordHasher = new PasswordHasher<User>();
        var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);

        return result == PasswordVerificationResult.Success;
    }

    public async Task<bool> RegisterUserAsync(string username, string password, ICollection<Role> roles)
    {
        var existingUser = await GetUserByUsernameAsync(username);
        if (existingUser is not null) return false;

        var user = new User(username, password, roles);
        _dbContext.Users.Add(user);

        try
        {
            await _dbContext.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateException)
        {
            return false;
        }
    }

    public async Task<User?> GetUserByUsernameAsync(string username) 
    {
        var normalizedUsername = username.ToLower();
        return await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username.ToLower() == normalizedUsername);
    }
}