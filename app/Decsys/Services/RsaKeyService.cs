using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Cryptography;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Decsys.Services
{

    // useful:
    // https://mkjwk.org/ <-- this. we use JWKs.

    // alternative RSA key parsing/generation
    // https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9
    // https://vcsjones.dev/2019/10/07/key-formats-dotnet-3/

    public static class RsaKeyService
    {
        /// <summary>
        /// Get an RSA Key for JWT Signing in IdentityServer
        /// </summary>
        /// <param name="config"></param>
        /// <returns></returns>
        public static RsaSecurityKey GetRsaKey(IConfiguration config)
        {
            var key = new Dictionary<string, string>();
            config.GetSection("Hosted:JwtSigningKey").Bind(key);

            // here we convert from a JSON Web Key
            // in which all the RSA params are specified
            // as separate base64url strings in JSON.
            // https://tools.ietf.org/html/rfc7517
            //
            // this works well for appsettings.json
            // but maybe not for environment variables?
            // TODO: Document the required key format for production environments
            // TODO: Validate use, format, algorithm
            var rsa = RSA.Create(new RSAParameters
            {
                P = WebEncoders.Base64UrlDecode(key["p"]),
                Q = WebEncoders.Base64UrlDecode(key["q"]),
                D = WebEncoders.Base64UrlDecode(key["d"]),
                DP = WebEncoders.Base64UrlDecode(key["dp"]),
                DQ = WebEncoders.Base64UrlDecode(key["dq"]),
                Exponent = WebEncoders.Base64UrlDecode(key["e"]),
                InverseQ = WebEncoders.Base64UrlDecode(key["qi"]),
                Modulus = WebEncoders.Base64UrlDecode(key["n"])
            });

            // Convert from a PKCS#1 string
            // Could be useful if we read from PEM files in future
            // Or find a nice way to otherwise load the strings
            // rsa.ImportRSAPrivateKey(Convert.FromBase64String(key), out _);

            return new RsaSecurityKey(rsa);
        }

        /// <summary>
        /// Get the base64 string of an RSA key in PKCS#1 format
        /// without the framing labels
        /// </summary>
        /// <param name="key">The full key string</param>
        /// <param name="pub">Is this a public key?</param>
        /// <returns></returns>
        public static string GetRsaKeyContent(string key, bool pub = false)
        {
            var trailer = $"RSA {(pub ? "PUBLIC" : "PRIVATE")} KEY-----";
            var header = $"-----BEGIN {trailer}";
            var footer = $"-----END {trailer}";

            if (!key.StartsWith(header) || !key.EndsWith(footer))
                throw new ArgumentException("Expected an RSA (PKCS#1) Key");

            return key.Replace(header, "").Replace(footer, "");
        }
    }
}
