using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using YourApp.Entity;

namespace YourApp.Services;

public class UserService(AppDbContext DbContext) : IUserService
{
    public async Task<bool> RegisterUserAsync(string username, string password, ICollection<string> roles)
    {
        var existingUser = await GetUserByUsernameAsync(username);
        if (existingUser is not null) return false;

        var existingRoles = await DbContext.Roles
            .Where(x => roles.Contains(x.Id))
            .ToListAsync();

        var user = new User(username, password, existingRoles);
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

    public async Task<bool> EditUserAsync(User user, string? username, string? password, ICollection<string>? roles)
    {
        if (!string.IsNullOrWhiteSpace(username))
        {
            var existingUser = await GetUserByUsernameAsync(username);
            if (existingUser is not null) return false;
        }

        ICollection<Role> existingRoles;
        if (roles != null && roles.Any())
        {
            existingRoles = await DbContext.Roles
                .Where(x => roles.Contains(x.Id))
                .ToListAsync();
        }
        else
        {
            existingRoles = user.Roles;
        }

        user.Update(username, password, existingRoles);

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

    public async Task<bool> DeleteUserAsync(User user)
    {
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
            .Include(x => x.Roles)
            .FirstOrDefaultAsync(u => u.Username.ToLower() == normalizedUsername);
    }

    public async Task<User?> GetUserByIdAsync(Guid id)
    {
        return await DbContext.Users
            .Include(x => x.Roles)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetCurrentAuthenticatedUserAsync(ClaimsPrincipal principal)
    {
        var sub = principal.FindFirstValue(ClaimTypes.NameIdentifier)
                  ?? principal.FindFirstValue("sub");
        if (sub is null) return null;
        if (!Guid.TryParse(sub, out var id)) return null;

        return await DbContext.Users
            .Include(x => x.Roles)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<ICollection<Scope>?> GetUserScopesAsync(string username)
    {
        var normalizedUsername = username.ToLower();
        var user = await DbContext.Users
            .Include(u => u.Roles)
                .ThenInclude(r => r.Scopes)
            .FirstOrDefaultAsync(u => u.Username.ToLower() == normalizedUsername);
        if (user is null) return null;

        var scopes = user.Roles
            .SelectMany(r => r.Scopes).ToList();

        return scopes;
    }
}