using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using YourApp.Entity;

namespace YourApp.Services;

public class UserService(AppDbContext DbContext) : IUserService
{
    public async Task<bool> RegisterUserAsync(string username, string password, ICollection<Role> roles)
    {
        var existingUser = await GetUserByUsernameAsync(username);
        if (existingUser is not null) return false;

        var user = new User(username, password, roles);
        DbContext.Users.Add(user);

        try
        {
            await DbContext.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateException)
        {
            return false;
        }
    }

    public async Task<bool> UpdateUserAsync(Guid id, string? username, string? password, ICollection<Role>? roles)
    {
        var user = await DbContext.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Id == id);
        if (user is null) return false;

        if (!string.IsNullOrWhiteSpace(username))
        {
            var existingUser = await GetUserByUsernameAsync(username);
            if (existingUser is not null) return false;
        }

        user.Update(username, password, roles);

        try
        {
            await DbContext.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateException)
        {
            return false;
        }
    }

    public async Task<bool> DeleteUserAsync(Guid id)
    {
        var user = await DbContext.Users.FindAsync(id);
        if (user is null) return false;

        DbContext.Users.Remove(user);

        try
        {
            await DbContext.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateException)
        {
            return false;
        }
    }

    public async Task<bool> ValidateCredentialsAsync(string username, string password)
    {
        var user = await GetUserByUsernameAsync(username);
        if (user is null) return false;

        var passwordHasher = new PasswordHasher<User>();
        var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);

        return result == PasswordVerificationResult.Success;
    }

    public async Task<User?> GetUserByUsernameAsync(string username) 
    {
        var normalizedUsername = username.ToLower();
        return await DbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username.ToLower() == normalizedUsername);
    }
}