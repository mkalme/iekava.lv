using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using YourApp.Utilities;

namespace YourApp.Services;

public class AuthService(IUserService UserService) : IAuthService
{
    public async Task<string> GenerateJwtTokenAsync(string username, TimeSpan lifespan)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        
        var now = DateTime.UtcNow;
        var expires = now.Add(lifespan);
        var user = await UserService.GetUserByUsernameAsync(username);
        if (user is null)
        {
            throw new ArgumentException("User not found", nameof(username));
        }

        var claims = new List<Claim>
        {
            new Claim("sub", user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, new DateTimeOffset(now).ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        foreach (var role in await GetUserScopes(username))
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

    private async Task<List<string>> GetUserScopes(string username)
    {
        var scopes = await UserService.GetUserScopesAsync(username);
        if (scopes is null) return [];

        var scopeNames = scopes
            .Select(s => s.Name)
            .Distinct()
            .ToList();

        return scopeNames;
    }

    public async Task<bool> ValidateUserCredentialsAsync(string username, string password)
    {
        return await UserService.ValidateCredentialsAsync(username, password);
    }
}