using System.Text;
using System.Threading.Tasks;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.WebUtilities;

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
    }
}
