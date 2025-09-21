using YourApp.Entity;

namespace YourApp.Services;

public interface IUserService
{
    Task<bool> RegisterUserAsync(string username, string password, ICollection<Role> roles);
    Task<bool> UpdateUserAsync(Guid id, string? username, string? password);
    Task<bool> DeleteUserAsync(Guid id);
    Task<bool> ValidateCredentialsAsync(string username, string password);
    Task<User?> GetUserByUsernameAsync(string username);
}