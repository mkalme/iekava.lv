using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YourApp.Utilities;

namespace YourApp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessageController : ControllerBase
{
    [HttpGet]
    [AuthorizeScopes("self.message.read")]
    public IActionResult GetOwnMessage()
    {
        var username = User?.Identity?.Name;
        return Ok(new { 
            message = "This is a message", 
            user = username,
            timestamp = DateTime.UtcNow 
        });
    }

    [HttpGet("{userId}")]
    [AuthorizeScopes("user.message.read")]
    public IActionResult GetUserMessage(Guid userId)
    {
        var username = User?.Identity?.Name;
        return Ok(new { 
            message = "This is a secret message from user: " + userId, 
            user = username,
            timestamp = DateTime.UtcNow 
        });
    }
}