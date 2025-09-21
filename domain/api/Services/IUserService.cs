using YourApp.Entity;

namespace YourApp.Services;

public interface IUserService
{
    Task<bool> ValidateCredentialsAsync(string username, string password);
    Task<bool> RegisterUserAsync(string username, string password, ICollection<Role> roles);
    Task<User?> GetUserByUsernameAsync(string username);
}