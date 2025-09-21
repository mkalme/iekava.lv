using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
        var secretKey = _configuration["JWT:SecretKey"] ?? "your-super-secret-key-here-make-it-long-and-complex";
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(secretKey);
        
        var now = DateTime.UtcNow;
        var expires = now.Add(lifespan);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim("username", username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Add unique identifier
                new Claim(JwtRegisteredClaimNames.Iat, new DateTimeOffset(now).ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64) // Add issued at time
            }),
            Expires = expires,
            NotBefore = now, // Add not before claim
            IssuedAt = now,  // Add issued at claim
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        return tokenString;
    }

    public async Task<bool> ValidateUserCredentialsAsync(string username, string password)
    {
        return await _userService.ValidateCredentialsAsync(username, password);
    }
}