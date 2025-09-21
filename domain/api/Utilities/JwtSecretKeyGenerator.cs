using System;
using System.Security.Cryptography;
using System.Text;

namespace YourApp.Utilities;

public class JwtSecretKeyGenerator
{
    /// <summary>
    /// Generate a cryptographically secure random secret key for JWT signing
    /// </summary>
    /// <param name="keySizeInBytes">Size of the key in bytes (default: 64 bytes = 512 bits)</param>
    /// <returns>Base64 encoded secret key</returns>
    public static byte[] GenerateSecretKey(int keySizeInBytes = 64)
    {
        using (var rng = RandomNumberGenerator.Create())
        {
            byte[] keyBytes = new byte[keySizeInBytes];
            rng.GetBytes(keyBytes);
            return keyBytes;
        }
    }

    /// <summary>
    /// Generate a secure key specifically for HMAC-SHA256 (recommended for JWT)
    /// </summary>
    /// <returns>Base64 encoded 256-bit key suitable for HMAC-SHA256</returns>
    public static byte[] GenerateHmacSha256Key()
    {
        // HMAC-SHA256 recommends key size >= hash output size (32 bytes)
        return GenerateSecretKey(32);
    }
}
