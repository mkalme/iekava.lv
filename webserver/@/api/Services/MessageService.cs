using Microsoft.EntityFrameworkCore;
using YourApp.Entity;

namespace YourApp.Services;

public class MessageService(AppDbContext DbContext) : IMessageService
{
    public async Task<string> GetTextAsync(User user)
    {
        var message = await DbContext.Messages
            .Include(x => x.Author)
            .FirstOrDefaultAsync(x => x.AuthorId == user.Id);

        if (message is null)
        {
            message = new Message(string.Empty, user);
            DbContext.Messages.Add(message);
            await DbContext.SaveChangesAsync();
        }

        return message.Text ?? string.Empty;
    }

    public async Task<bool> SetTextAsync(User user, string? text)
    {
        var message = await DbContext.Messages
            .Include(x => x.Author)
            .FirstOrDefaultAsync(x => x.AuthorId == user.Id);

        if (message is null)
        {
            message = new Message(text, user);
            DbContext.Messages.Add(message);
        }
        else
        {
            message.Text = text;
        }
        
        await DbContext.SaveChangesAsync();
        return true;
    }
}