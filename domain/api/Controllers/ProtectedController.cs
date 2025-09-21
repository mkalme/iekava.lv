using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace YourApp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProtectedController : ControllerBase
{
    [HttpGet]
    public IActionResult GetProtectedData()
    {
        var username = User?.Identity?.Name;
        return Ok(new { 
            message = "This is protected data!", 
            user = username,
            timestamp = DateTime.UtcNow 
        });
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")] // Example of role-based authorization
    public IActionResult GetAdminData()
    {
        return Ok(new { message = "This is admin-only data!" });
    }
}