using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YourApp.Services;
using YourApp.Utilities;

namespace YourApp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessageController(IUserService UserService, IMessageService MessageService) : ControllerBase
{
    [HttpGet]
    [AuthorizeScopes("self.message.read")]
    public async Task<IActionResult> GetOwnMessageAsync()
    {
        var user = await UserService.GetCurrentAuthenticatedUserAsync(User);
        if (user is null) return Unauthorized(new { error = "User not found or unauthorized" });

        var text = await MessageService.GetTextAsync(user);
        return Ok(new
        {
            message = text,
        });
    }

    [HttpPost("{text?}")]
    [AuthorizeScopes("self.message.write")]
    public async Task<IActionResult> WriteOwnMessageAsync(string? text)
    {
        var user = await UserService.GetCurrentAuthenticatedUserAsync(User);
        if (user is null) return Unauthorized(new { error = "User not found or unauthorized" });

        await MessageService.SetTextAsync(user, text);
        return Ok();
    }

    [HttpGet("{userId}")]
    [AuthorizeScopes("user.message.read")]
    public async Task<IActionResult> GetUserMessageAsync(Guid userId)
    {
        var user = await UserService.GetUserByIdAsync(userId);
        if (user is null) return Unauthorized(new { error = "User not found" });

        var text = await MessageService.GetTextAsync(user);
        return Ok(new
        {
            message = text,
        });
    }

    [HttpPost("{userId}/{text?}")]
    [AuthorizeScopes("user.message.write")]
    public async Task<IActionResult> WriteMessageAsync(Guid userId, string? text)
    {
        var user = await UserService.GetUserByIdAsync(userId);
        if (user is null) return Unauthorized(new { error = "User not found or unauthorized" });

        await MessageService.SetTextAsync(user, text);
        return Ok();
    }
}