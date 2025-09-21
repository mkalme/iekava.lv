using Microsoft.IdentityModel.Tokens;
using System.Reflection;

namespace YourApp.Utilities;

public class JwtSecretKeyProvider
{
    /// <summary>
    /// Gets the JWT secret key from secure configuration
    /// </summary>
    public static SymmetricSecurityKey GetKey() {
        var exeDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        if (string.IsNullOrEmpty(exeDir)) {
            throw new NullReferenceException();
        }

        var jwtPath = Path.Combine(exeDir, "jwt.key");

        if (File.Exists(jwtPath))
        {
            return new SymmetricSecurityKey(File.ReadAllBytes(jwtPath));
        }

        var generatedKey = JwtSecretKeyGenerator.GenerateHmacSha256Key();
        File.WriteAllBytes(jwtPath, generatedKey);

        return new SymmetricSecurityKey(generatedKey);
    }
}