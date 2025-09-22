using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YourApp.Models;
using YourApp.Services;
using YourApp.Utilities;

namespace YourApp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController(IUserService UserService) : ControllerBase
{
    [HttpPost("register")]
    [AuthorizeScopes("user.register")]
    public async Task<ActionResult> RegisterUserAsync([FromBody] CreateUserRequest request)
    {
        var success = await UserService.RegisterUserAsync(request.Username, request.Password, request.Roles);
        if (!success) return Conflict(new { message = "User already exists or could not be created." });

        return Ok(new { message = "User registered successfully." });
    }

    [HttpPut("edit/username")]
    [AuthorizeScopes("self.edit.username")]
    public async Task<ActionResult> EditOwnUsernameAsync([FromBody] UsernameEditRequest request)
    {
        var user = await UserService.GetCurrentAuthenticatedUserAsync(User);
        if (user is null) return Unauthorized(new { error = "User not found or unauthorized" });

        var updated = await UserService.EditUserAsync(user, username: request.Username, password: null, roles: null);
        if (!updated) return NotFound(new { message = "User not found." });

        return Ok(new { message = "User updated successfully." });
    }

    [HttpPut("edit/username/{userId}")]
    [AuthorizeScopes("user.edit.username")]
    public async Task<ActionResult> EditUsernameAsync(Guid userId, [FromBody] UsernameEditRequest request)
    {
        var user = await UserService.GetUserByIdAsync(userId);
        if (user is null) return Unauthorized(new { error = "User not found" });

        var updated = await UserService.EditUserAsync(user, username: request.Username, password: null, roles: null);
        if (!updated) return NotFound(new { message = "User not found." });

        return Ok(new { message = "User updated successfully." });
    }

    [HttpPut("edit/password")]
    [AuthorizeScopes("self.edit.password")]
    public async Task<ActionResult> EditOwnPasswordAsync([FromBody] PasswordEditRequest request)
    {
        var user = await UserService.GetCurrentAuthenticatedUserAsync(User);
        if (user is null) return Unauthorized(new { error = "User not found or unauthorized" });

        var updated = await UserService.EditUserAsync(user, username: null, request.Password, roles: null);
        if (!updated) return NotFound(new { message = "User not found." });

        return Ok(new { message = "User updated successfully." });
    }

    [HttpPut("edit/password/{userId}")]
    [AuthorizeScopes("user.edit.password")]
    public async Task<ActionResult> EditPasswordAsync(Guid userId, [FromBody] PasswordEditRequest request)
    {
        var user = await UserService.GetUserByIdAsync(userId);
        if (user is null) return Unauthorized(new { error = "User not found" });

        var updated = await UserService.EditUserAsync(user, username: null, request.Password, roles: null);
        if (!updated) return NotFound(new { message = "User not found." });

        return Ok(new { message = "User updated successfully." });
    }

    [HttpPut("edit/roles/{userId}")]
    [AuthorizeScopes("user.edit.scopes")]
    public async Task<ActionResult> EditRolesAsync(Guid userId, [FromBody] RolesEditRequest request)
    {
        var user = await UserService.GetUserByIdAsync(userId);
        if (user is null) return Unauthorized(new { error = "User not found" });

        var updated = await UserService.EditUserAsync(user, username: null, password: null, roles: request.Roles);
        if (!updated) return NotFound(new { message = "User not found." });

        return Ok(new { message = "User updated successfully." });
    }

    [HttpDelete("delete")]
    [AuthorizeScopes("self.delete")]
    public async Task<ActionResult> DeleteOwnAsync()
    {
        var user = await UserService.GetCurrentAuthenticatedUserAsync(User);
        if (user is null) return Unauthorized(new { error = "User not found or unauthorized" });

        var deleted = await UserService.DeleteUserAsync(user);
        if (!deleted) return NotFound(new { message = "User not found." });

        return Ok(new { message = "User deleted successfully." });
    }

    [HttpDelete("delete/{userId}")]
    [AuthorizeScopes("user.delete")]
    public async Task<ActionResult> DeleteUserAsync(Guid userId)
    {
        var user = await UserService.GetUserByIdAsync(userId);
        if (user is null) return Unauthorized(new { error = "User not found" });

        var deleted = await UserService.DeleteUserAsync(user);
        if (!deleted) return NotFound(new { message = "User not found." });

        return Ok(new { message = "User deleted successfully." });
    }
}