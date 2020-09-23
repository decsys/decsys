using System;
using Microsoft.AspNetCore.Http;

namespace Decsys.Constants
{
    public static class ClientRoutes
    {
        public const string LoginForm = "/auth/login";

        public const string RegisterForm = "/user/register";

        public const string ResetPasswordForm = "/user/password/reset";

        public static string UserFeedback(string category, string state)
            => $"/user/feedback/{category}/{state}";

        #region Extensions

        public static Uri ToLocalUrl(this string path, HttpRequest request)
            => new Uri(new Uri($"{request.Scheme}://{request.Host}"), path);

        public static string ToLocalUrlString(this string path, HttpRequest request)
            => path.ToLocalUrl(request).ToString();

        #endregion
    }
}
