using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YourApp.Models;
using YourApp.Services;

namespace YourApp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController(IUserService UserService) : ControllerBase
{
    [HttpPost("register")]
    [Authorize(Policy = "Scope:user.register")]
    public async Task<ActionResult> RegisterUser([FromBody] CreateUserRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var success = await UserService.RegisterUserAsync(request.Username, request.Password, request.Roles);
        if (!success) return Conflict(new { message = "User already exists or could not be created." });

        return Ok(new { message = "User registered successfully." });
    }

    [HttpPut("update/{id}")]
    [Authorize(Policy = "Scope:user.update")]
    public async Task<ActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var updated = await UserService.UpdateUserAsync(id, request.Username, request.Password, request.Roles);
        if (!updated) return NotFound(new { message = "User not found." });

        return Ok(new { message = "User updated successfully." });
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Policy = "Scope:user.delete")]
    public async Task<ActionResult> DeleteUser(Guid id)
    {
        var deleted = await UserService.DeleteUserAsync(id);
        if (!deleted) return NotFound(new { message = "User not found." });

        return Ok(new { message = "User deleted successfully." });
    }
}