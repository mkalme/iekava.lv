namespace YourApp.Services;

public interface IAuthService
{
    string GenerateJwtToken(string username, TimeSpan lifespan);
    Task<bool> ValidateUserCredentialsAsync(string username, string password);
}