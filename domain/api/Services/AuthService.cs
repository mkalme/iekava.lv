using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using YourApp.Utilities;

namespace YourApp.Services;

public class AuthService(IUserService UserService) : IAuthService
{
    public string GenerateJwtToken(string username, TimeSpan lifespan)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        
        var now = DateTime.UtcNow;
        var expires = now.Add(lifespan);
        
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, username),
            new Claim("username", username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, new DateTimeOffset(now).ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        foreach (var role in GetUserScopes(username))
        {
            claims.Add(new Claim("scope", role));
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

    private List<string> GetUserScopes(string username)
    {
        var user = UserService.GetUserByUsernameAsync(username).Result;
        if (user is null) return [];

        var scopes = user.Roles
            .SelectMany(r => r.Scopes)
            .Select(s => s.Name)
            .Distinct()
            .ToList();

        return scopes;
    }

    public async Task<bool> ValidateUserCredentialsAsync(string username, string password)
    {
        return await UserService.ValidateCredentialsAsync(username, password);
    }
}