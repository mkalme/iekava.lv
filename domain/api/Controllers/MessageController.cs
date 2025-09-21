using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace YourApp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessageController : ControllerBase
{
    [HttpGet]
    [Authorize(Policy = "Scope:user.message.read")]
    public IActionResult GetMessage()
    {
        var username = User?.Identity?.Name;
        return Ok(new { 
            message = "This is a message", 
            user = username,
            timestamp = DateTime.UtcNow 
        });
    }
}