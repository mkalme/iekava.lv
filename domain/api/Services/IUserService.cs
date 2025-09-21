namespace YourApp.Services;

public interface IUserService
{
    Task<bool> ValidateCredentialsAsync(string username, string password);
}