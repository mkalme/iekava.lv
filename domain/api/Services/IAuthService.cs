namespace YourApp.Services;

public interface IAuthService
{
    Task<string> GenerateJwtTokenAsync(string username, TimeSpan lifespan);
    Task<bool> ValidateUserCredentialsAsync(string username, string password);
}