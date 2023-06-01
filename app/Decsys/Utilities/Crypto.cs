using System.Security.Cryptography;
using IdentityModel;
using Microsoft.IdentityModel.Tokens;

namespace Decsys.Utilities;

public static class Crypto
{
    private static readonly RandomNumberGenerator _rng = RandomNumberGenerator.Create();

    /// <summary>
    /// Generates a cryptographically random byte array
    /// </summary>
    /// <param name="length">The desired length of the byte array</param>
    private static byte[] GenerateRandomBytes(int length)
    {
        var bytes = new byte[length];
        _rng.GetBytes(bytes);
        return bytes;
    }

    /// <summary>
    /// <para>Generate a Unique ID as a string in the specified format.</para>
    /// <para>
    /// If the Unique ID is of sufficient byte length, it can be considered a strong secure ID, suitable for use a hashed secret.
    /// e.g. a length of 32 will give a 256bit strong value.
    /// </para>
    /// </summary>
    /// <param name="length">The length</param>
    /// <param name="format">The output format</param>
    public static string GenerateId(int length = 32, CryptoRandom.OutputFormat format = CryptoRandom.OutputFormat.Base64Url)
    {
        var id = GenerateRandomBytes(length);

        return format switch
        {
            CryptoRandom.OutputFormat.Base64Url => Base64UrlEncoder.Encode(id),
            CryptoRandom.OutputFormat.Base64 => Convert.ToBase64String(id),
            CryptoRandom.OutputFormat.Hex => BitConverter.ToString(id).Replace("-", ""),
            _ => throw new ArgumentException("Invalid OutputFormat", nameof(format))
        };
    }
    
}
