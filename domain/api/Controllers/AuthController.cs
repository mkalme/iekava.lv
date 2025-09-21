using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YourApp.Models;
using YourApp.Services;

namespace YourApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { error = "Invalid credentials", message = "Username and password are required" });
        }
        
        var isValidUser = await _authService.ValidateUserCredentialsAsync(request.Username, request.Password);
        if (!isValidUser)
        {
            return Unauthorized(new { error = "Invalid credentials", message = "Username or password is incorrect" });
        }
        
        var cookieAndTokenLifespan = TimeSpan.FromHours(1);
        var token = _authService.GenerateJwtToken(request.Username, cookieAndTokenLifespan);
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.Add(cookieAndTokenLifespan),
            Path = "/"
        };
        
        Response.Cookies.Append("authToken", token, cookieOptions);
        
        var response = new LoginResponse
        {
            Message = "Login successful",
            Username = request.Username,
            ExpiresIn = Convert.ToInt32(cookieAndTokenLifespan.TotalSeconds)
        };
        
        return Ok(response);
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(-1),
            Path = "/"
        };
        
        Response.Cookies.Append("authToken", "", cookieOptions);
        
        return Ok(new { message = "Logged out successfully" });
    }
}