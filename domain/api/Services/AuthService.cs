using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using YourApp.Utilities;

namespace YourApp.Services;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IUserService _userService;

    public AuthService(IConfiguration configuration, IUserService userService)
    {
        _configuration = configuration;
        _userService = userService;
    }

    public string GenerateJwtToken(string username, TimeSpan lifespan)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        
        var now = DateTime.UtcNow;
        var expires = now.Add(lifespan);
        
        // Create claims list
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, username),
            new Claim("username", username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, new DateTimeOffset(now).ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };
        
        // Add role claims
        var userRoles = GetUserRoles(username);
        foreach (var role in userRoles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expires,
            NotBefore = now,
            IssuedAt = now,
            SigningCredentials = new SigningCredentials(JwtSecretKeyProvider.GetKey(), SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        return tokenString;
    }

    private List<string> GetUserRoles(string username)
    {
        // In a real application, you'd get roles from your database
        // For demo purposes, using hardcoded roles
        var userRoles = new Dictionary<string, List<string>>
        {
            { "admin", new List<string> { "Admin", "User" } },
            { "user", new List<string> { "User" } }
        };
        
        return userRoles.ContainsKey(username.ToLower()) 
            ? userRoles[username.ToLower()] 
            : new List<string> { "User" }; // Default role
    }

    public async Task<bool> ValidateUserCredentialsAsync(string username, string password)
    {
        return await _userService.ValidateCredentialsAsync(username, password);
    }
}