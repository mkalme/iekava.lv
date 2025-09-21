using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YourApp.Models;

namespace YourApp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Require authentication for all endpoints in this controller
public class UsersController : ControllerBase
{
    [HttpGet]
    public IActionResult GetUsers()
    {
        // Example: Get all users
        var users = new[] 
        {
            new { Id = 1, Username = "admin", Email = "admin@example.com" },
            new { Id = 2, Username = "user", Email = "user@example.com" }
        };
        
        return Ok(users);
    }

    [HttpGet("{id}")]
    public IActionResult GetUser(int id)
    {
        // Example: Get user by ID
        if (id <= 0)
        {
            return BadRequest("Invalid user ID");
        }

        var user = new { Id = id, Username = "user" + id, Email = $"user{id}@example.com" };
        return Ok(user);
    }

    [HttpPost]
    public IActionResult CreateUser([FromBody] CreateUserRequest request)
    {
        // Add validation logic here
        if (string.IsNullOrWhiteSpace(request.Username))
        {
            return BadRequest("Username is required");
        }

        var newUser = new { Id = 999, Username = request.Username, Email = request.Email };
        return CreatedAtAction(nameof(GetUser), new { id = 999 }, newUser);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, [FromBody] UpdateUserRequest request)
    {
        var updatedUser = new { Id = id, Username = request.Username, Email = request.Email };
        return Ok(updatedUser);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        return NoContent(); // 204 No Content
    }
}