using System;
using Newtonsoft.Json;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Decsys.Auth;
using Decsys.Models.Account;
using IdentityServer4.Events;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Decsys.Data.Entities;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [AllowAnonymous]
    public class AccountController : ControllerBase
    {
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IClientStore _clients;
        private readonly IEventService _events;
        private readonly SignInManager<DecsysUser> _signIn;
        private readonly UserManager<DecsysUser> _users;
        private readonly IConfiguration _config;

        public AccountController(
            IIdentityServerInteractionService interaction,
            IClientStore clients,
            IEventService events,
            UserManager<DecsysUser> users,
            SignInManager<DecsysUser> signIn,
            IConfiguration config)
        {
            _interaction = interaction;
            _clients = clients;
            _events = events;
            _signIn = signIn;
            _users = users;
            _config = config;
        }

        private List<string> CollapseModelStateErrors(ModelStateDictionary modelState)
            => modelState.Keys
                .SelectMany(k => modelState[k].Errors
                    .Select(x => !string.IsNullOrWhiteSpace(k)
                        ? $"{k}: {x.ErrorMessage}"
                        : x.ErrorMessage))
                .ToList();


        #region Login

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
        public async Task<IActionResult> Login([FromForm] Login model)
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
                return model.ReturnUrl switch
                {
                    var url when string.IsNullOrEmpty(url) => Redirect("~/"),
                    var url when Url.IsLocalUrl(url!) => Redirect(model.ReturnUrl),
                    _ => throw new InvalidOperationException("Invalid Return URL")
                };
            }

            if (ModelState.IsValid)
            {
                // Validate credentials
                var result = await _signIn.PasswordSignInAsync(model.Username, model.Password, false, true);

                var user = await _users.FindByNameAsync(model.Username);

                if (result.Succeeded)
                {
                    await _events.RaiseAsync(new UserLoginSuccessEvent(
                        user.UserName,
                        user.Id.ToString(),
                        user.UserName, // TODO: store actual name of users?
                        clientId: context?.Client.ClientId));

                    return model.ReturnUrl switch
                    {
                        var url when string.IsNullOrEmpty(url) => Redirect("~/"),
                        var url when Url.IsLocalUrl(url!) => Redirect(model.ReturnUrl),
                        _ => throw new InvalidOperationException("Invalid Return URL")
                    };
                }

                // handle various failure scenarios appropriately

                string eventError = "Login failure";
                var friendlyError = "The username and/or password are invalid, or otherwise not allowed.";

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

            var vm = new
            {
                model.Username,
                errors = CollapseModelStateErrors(ModelState)
            };

            // redirect back to the login form in the event of failure
            return Redirect(
                $"/auth/login?ReturnUrl={WebUtility.UrlEncode(model.ReturnUrl)}" +
                $"&ViewModel={JsonConvert.SerializeObject(vm).Utf8ToBase64Url()}");
        }

        #endregion

        #region Logout

        // We don't use logout confirmation
        // Since no third party clients
        // So this is a GET request only, which OIDC makes
        [HttpGet("logout")]
        // Logout actually cares about our Cookie auth scheme, so it can sign it out correctly
        // Since its the only route in the app that does, we just decorate it here
        [Authorize(AuthenticationSchemes = "Identity.Application")]
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
            // we're fortunate in knowing we only have one client
            // so we can use its config directly
            return Redirect(IdentityServerConfig
                .Clients(_config["Hosted:Origin"]).Single()
                .PostLogoutRedirectUris.FirstOrDefault()
                ?? "~/");
        }

        #endregion

        #region Register

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] Register model)
        {
            if (ModelState.IsValid) // Perform additional Model validation
            {
                // Client side should catch these, but we should be on the safe side.
                if (model.Email != model.EmailConfirm)
                    ModelState.AddModelError(string.Empty, "The email addresses entered do not match.");
                if (model.Password != model.PasswordConfirm)
                    ModelState.AddModelError(string.Empty, "The passwords entered do not match.");
            }

            if (ModelState.IsValid) // Actual success route
            {
                var user = new DecsysUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    Fullname = model.Fullname
                };

                var result = await _users.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    //await _tokens.WithUrlHelper(Url).SendAccountConfirmation(user);
                    return Redirect("/user/registered");
                }

                foreach (var error in result.Errors)
                {
                    //if (error.Code == "DuplicateEmail")
                    //{
                    //    var existingUser = await _users.FindByEmailAsync(model.Email);
                    //    if (!existingUser.EmailConfirmed) allowResend = true;
                    //}
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            var vm = new
            {
                model.Email,
                model.EmailConfirm,
                model.Fullname,
                errors = CollapseModelStateErrors(ModelState)
            };
            return Redirect(
                "/user/register" +
                $"?ViewModel={JsonConvert.SerializeObject(vm).Utf8ToBase64Url()}");
        }

        #endregion
    }
}
