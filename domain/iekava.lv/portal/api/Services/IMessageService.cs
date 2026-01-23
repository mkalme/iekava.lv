using YourApp.Entity;

namespace YourApp.Services;

public interface IMessageService
{
    Task<string> GetTextAsync(User user);
    Task<bool> SetTextAsync(User user, string? text);
}