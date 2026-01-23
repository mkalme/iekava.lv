using System.Security.Claims;
using YourApp.Entity;

namespace YourApp.Services;

public interface IUserService
{
    Task<bool> RegisterUserAsync(string username, string password, ICollection<string> roles);
    Task<bool> EditUserAsync(User user, string? username, string? password, ICollection<string>? roles);
    Task<bool> DeleteUserAsync(User user);
    Task<bool> ValidateCredentialsAsync(string username, string password);
    Task<User?> GetUserByUsernameAsync(string username);
    Task<User?> GetUserByIdAsync(Guid id);
    Task<User?> GetCurrentAuthenticatedUserAsync(ClaimsPrincipal principal);
    Task<ICollection<Scope>?> GetUserScopesAsync(string username);
}