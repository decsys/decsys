using System;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Threading.Tasks;
using Decsys.Auth;
using IdentityServer4.Events;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Decsys.Controllers
{
    public class LoginModel
    {
        [Required]
        [EmailAddress]
        public string Username { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        public string Button { get; set; } = string.Empty;

        public string? ReturnUrl { get; set; }
    }

    [ApiController]
    [Route("[controller]")]
    [AllowAnonymous]
    public class AccountController : ControllerBase
    {
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IClientStore _clients;
        private readonly IEventService _events;
        private readonly SignInManager<IdentityUser> _signIn;
        private readonly UserManager<IdentityUser> _users;

        public AccountController(
            IIdentityServerInteractionService interaction,
            IClientStore clients,
            IEventService events,
            UserManager<IdentityUser> users,
            SignInManager<IdentityUser> signIn)
        {
            _interaction = interaction;
            _clients = clients;
            _events = events;
            _signIn = signIn;
            _users = users;
        }

        // GET: Login
        // Right now we do nothing before loading the login form client-side
        // But there are some conceivably desirable Identity Server operations
        // prior to rendering the login form.
        // We could do them with an interim step that takes those actions,
        // and then redirects to react, with a payload somehow?
        // Or react could hit a route here on page load
        // to do the initial bits
        //
        // Technically we should check whether the Client
        // a) Allows local login
        // b) Allows any external providers for login
        // But currently we know that we only allow local login
        // so all valid clients must allow it and have no external providers.
        //
        // This may change, and if it does should be checked and recorded prior to the Login Form loading?

        // if we've come from a client, we may want to pre-populate an expected username
        // var context = await _interaction.GetAuthorizationContextAsync(returnUrl);
        // Username = context?.LoginHint ?? string.Empty;

        [HttpPost("login")]
        // This purely handles the server side sign in
        // it's posted to by the frontend client
        public async Task<IActionResult> Login([FromForm] LoginModel model)
        {
            // Check that we're in the context of an autho request
            var context = await _interaction.GetAuthorizationContextAsync(model.ReturnUrl);

            if (model.Button != "login") // login form cancelled
            {
                if (context is null) return Redirect("~/");

                // if the user cancels, send a result back into IdentityServer as if they 
                // denied the consent (even if this client does not require consent).
                // this will send back an access denied OIDC error response to the client.
                await _interaction.DenyAuthorizationAsync(context, AuthorizationError.AccessDenied);
                return await ContextAwareRedirect(context, model.ReturnUrl);
            }

            string friendlyError = "";

            if (ModelState.IsValid)
            {
                // Validate credentials
                var result = await _signIn.PasswordSignInAsync(model.Username, model.Password, false, true);

                var user = await _users.FindByNameAsync(model.Username);

                if (result.Succeeded)
                {
                    await _events.RaiseAsync(new UserLoginSuccessEvent(
                        user.UserName,
                        user.Id,
                        user.UserName, // TODO: store actual name of users?
                        clientId: context?.Client.ClientId));

                    if (context is { }) return await ContextAwareRedirect(context, model.ReturnUrl);

                    return model.ReturnUrl switch
                    {
                        var url when Url.IsLocalUrl(url) => Redirect(model.ReturnUrl),
                        var url when string.IsNullOrEmpty(url) => Redirect("~/"),
                        _ => throw new InvalidOperationException("Invalid Return URL")
                    };
                }

                // handle various failure scenarios appropriately

                string eventError = "Login failure";
                friendlyError = "The username and/or password are invalid, or otherwise not allowed.";

                if (result.IsLockedOut)
                {
                    eventError = "Account locked out";
                    friendlyError = "This account is currently locked out. Please try again later.";
                }

                if (result.RequiresTwoFactor)
                    throw new NotImplementedException("2 Factor Authentication is not yet handled.");

                // all other disallowed cases
                if (result.IsNotAllowed)
                {
                    // TODO: handle resending confirmation email
                    // but we don't have account confirmations (yet)
                    //if (user is { } && !user.EmailConfirmed)
                    //    AllowResend = true;

                    eventError = "Credentials not allowed";
                }

                // log the failure and set model state errors if appropriate
                await _events.RaiseAsync(new UserLoginFailureEvent(
                        model.Username,
                        error: eventError,
                        clientId: context?.Client.ClientId));
                ModelState.AddModelError(string.Empty, friendlyError);
            }

            // redirect back to the login form in the event of failure
            return Redirect(
                $"/auth/login?ReturnUrl={WebUtility.UrlEncode(model.ReturnUrl)}" +
                $"&Username={model.Username.Utf8ToBase64Url()}" +
                (!string.IsNullOrWhiteSpace(friendlyError)
                    ? $"&Error={friendlyError.Utf8ToBase64Url()}"
                    : ""));
        }

        [HttpGet("logout")]
        // We don't use logout confirmation
        // Since no third party clients
        // So this is a GET request only, which OIDC makes
        public async Task<IActionResult> Logout(string? logoutId)
        {
            var logout = await _interaction.GetLogoutContextAsync(logoutId);

            // If external IdP's are supported, we should check the user
            // to see which providers/schemes we should be signing out of
            // but for now, we don't use this functionality
            if (User?.Identity?.IsAuthenticated is true)
            {
                await _signIn.SignOutAsync();

                await _events.RaiseAsync(new UserLogoutSuccessEvent(
                    User.GetSubjectId(),
                    User.GetDisplayName()));
            }

            // Here's where we'd trigger our external signouts if we had any
            // https://imgflip.com/s/meme/This-Is-Where-Id-Put-My-Trophy-If-I-Had-One.jpg

            // If we were supporting any kind of single sign on
            // sign out callbacks for any signed in services
            // would be performed in an iframe.
            // we can skip this as we only have one signed in service ever: this one.
            // SignOutIframeUrl = logout?.SignOutIFrameUrl;

            // we do a simple redirect here
            return Redirect(logout?.PostLogoutRedirectUri);
        }

        private async Task<IActionResult> ContextAwareRedirect(AuthorizationRequest context, string? returnUrl)
        {
            var url = returnUrl ?? "~/";

            if (await _clients.IsPkceClientAsync(context.Client.ClientId))
            {
                // if the client is PKCE then we assume it's native, so this change in how to
                // return the response is for better UX for the end user.

                //RedirectUrl = url;
                // TODO: how to pass on returnUrl?
                // query param presumably
                return Redirect(context?.RedirectUri);
            }

            // we can trust model.ReturnUrl since GetAuthorizationContextAsync returned non-null
            return Redirect(url);
        }
    }
}
