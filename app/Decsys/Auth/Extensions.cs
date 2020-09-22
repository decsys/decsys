using System;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Newtonsoft.Json;

namespace Decsys.Auth
{
    public static class Extensions
    {
        /// <summary>
        /// Determines whether the client is configured to use PKCE.
        /// </summary>
        /// <param name="store">The store.</param>
        /// <param name="client_id">The client identifier.</param>
        public static async Task<bool> IsPkceClientAsync(this IClientStore store, string client_id)
        {
            if (string.IsNullOrWhiteSpace(client_id)) return false;

            return (await store.FindEnabledClientByIdAsync(client_id))?
                .RequirePkce ?? false;
        }

        /// <summary>
        /// Encode a UTF8 string as a Base64Url string
        /// </summary>
        /// <param name="input"></param>
        public static string Utf8ToBase64Url(this string input)
            => WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(input));

        /// <summary>
        /// Decode a Base64Url string to a UT8 string
        /// </summary>
        /// <param name="input"></param>
        public static string Base64UrltoUtf8(this string input)
            => Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(input));

        public static object ObjectToBase64UrlJson(this object input)
            => JsonConvert.SerializeObject(input).Utf8ToBase64Url();


        public static bool IsSuperUser(this ClaimsPrincipal user)
            => user.FindFirstValue(ClaimTypes.Email) == SuperUser.EmailAddress;

        public static string GetUserId(this ClaimsPrincipal user)
            => user.GetUserIdOrDefault()
                ?? throw new InvalidOperationException("The current user has no NameIdentifier claim!");

        public static string GetUserIdOrDefault(this ClaimsPrincipal user)
            => user.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
