using System;
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
using System.Security.Claims;
using Decsys.Services;
using Decsys.Services.EmailServices;
using Decsys.Models.Emails;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace Decsys.Controllers
{
    // Detailed AccountState data for ViewModels
    public class AccountState
    {
        // Many of these are mutually exclusive
        // or we shortcut when setting them
        // so only the most pertinent value is set.
        // This shouldn't hinder the frontend,
        // but it shouldn't be assumed this is
        // a complete snapshot of state at any given time.

        // Account Registration Stages
        public bool? RequiresEmailConfirmation { get; set; }
        public bool? RequiresApproval { get; set; }
        public bool? RegistrationComplete { get; set; }

        // Account Approval
        public bool? AccountApproved { get; set; }
        public bool? AccountRejected { get; set; }
    }

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
        private readonly TokenIssuingService _tokens;
        private readonly AccountEmailService _emails;
        private readonly bool _approvalRequired;

        public AccountController(
            IIdentityServerInteractionService interaction,
            IClientStore clients,
            IEventService events,
            UserManager<DecsysUser> users,
            SignInManager<DecsysUser> signIn,
            IConfiguration config,
            TokenIssuingService tokens,
            AccountEmailService emails)
        {
            _interaction = interaction;
            _clients = clients;
            _events = events;
            _signIn = signIn;
            _users = users;
            _config = config;
            _tokens = tokens;
            _emails = emails;

            // shortcut some config
            _approvalRequired = _config.GetValue<bool>("Hosted:AccountApprovalRequired");
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

            // allow us to inform the form of detailed states we care about
            AccountState accountState = new();

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
                        user.Fullname,
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
                    // But WHY was it disallowed?
                    // Distinguish some specific cases we care about
                    // So the login form can behave accordingly

                    if (user is { })
                    {
                        accountState.RequiresEmailConfirmation = !user.EmailConfirmed;
                        accountState.RequiresApproval =
                            _approvalRequired && user.ApprovalDate is null && user.RejectionDate is null;

                        if (_approvalRequired && user.RejectionDate.HasValue)
                            friendlyError = "This account has been rejected for approval.";
                    }

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
                errors = CollapseModelStateErrors(ModelState),
                accountState
            };

            // redirect back to the login form in the event of failure
            return Redirect(
                $"/auth/login?ReturnUrl={WebUtility.UrlEncode(model.ReturnUrl)}" +
                $"&ViewModel={vm.ObjectToBase64UrlJson()}");
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

            // allow us to inform the form of detailed states we care about
            AccountState accountState = new();

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
                    await _tokens.SendAccountConfirmation(user);

                    var successVm = new
                    {
                        accountState = new AccountState { RequiresEmailConfirmation = true }
                    };
                    return Redirect("/user/feedback" +
                        $"?ViewModel={successVm.ObjectToBase64UrlJson()}");
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);

                    if (new[] { "DuplicateEmail", "DuplicateUserName" }.Contains(error.Code))
                    {
                        var existingUser = await _users.FindByEmailAsync(model.Email);

                        accountState.RequiresEmailConfirmation = !existingUser.EmailConfirmed;
                        accountState.RequiresApproval = _approvalRequired && existingUser.ApprovalDate is null;

                        if (_approvalRequired && existingUser.RejectionDate.HasValue)
                            ModelState.AddModelError(string.Empty, "This account has been rejected for approval.");
                    }
                }
            }

            var vm = new
            {
                model.Email,
                model.EmailConfirm,
                model.Fullname,
                errors = CollapseModelStateErrors(ModelState),
                accountState
            };
            return Redirect(
                "/user/register" +
                $"?ViewModel={vm.ObjectToBase64UrlJson()}");
        }

        #endregion

        #region Email Address Confirmation

        [HttpGet("confirm/{userId}/{code}")]
        public async Task<IActionResult> Confirm(string userId, string code)
        {
            var generalError = "The User ID or Token is invalid or has expired.";

            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code))
                ModelState.AddModelError(string.Empty, generalError);

            AccountState accountState = new();

            if (ModelState.IsValid)
            {
                code = code.Base64UrltoUtf8();

                var user = await _users.FindByIdAsync(userId);
                if (user is null)
                {
                    ModelState.AddModelError(string.Empty, generalError);
                }
                else
                {
                    var result = await _users.ConfirmEmailAsync(user, code);

                    if (result.Errors.Any())
                    {
                        ModelState.AddModelError(string.Empty, generalError);
                    }
                    else
                    {
                        if (_approvalRequired)
                        {
                            if (user.ApprovalDate is null && user.RejectionDate is null)
                            {
                                accountState.RequiresApproval = true;
                                await _tokens.SendAccountApprovalRequest(user);
                            }

                            if (user.RejectionDate.HasValue)
                                ModelState.AddModelError(string.Empty, "This account has been rejected for approval.");
                        }
                        else
                        {
                            // No Approval required
                            // Make them an admin
                            await _users.AddClaimAsync(user,
                                new Claim(ClaimTypes.Role, "survey.admin"));

                            // and sign them in!
                            await _signIn.SignInAsync(user, false);

                            accountState.RegistrationComplete = true;
                        }
                    }
                }
            }

            var vm = new
            {
                errors = CollapseModelStateErrors(ModelState),
                accountState
            };

            return Redirect("/user/feedback"
                + $"?ViewModel={vm.ObjectToBase64UrlJson()}");
        }

        [HttpGet("confirm/resend/{b64email}")]
        public async Task<IActionResult> ConfirmResend(string b64email)
        {
            var email = b64email.Base64UrltoUtf8();

            var user = await _users.FindByEmailAsync(email);
            if (user is null)
                ModelState.AddModelError(string.Empty, "Couldn't find the specified user.");
            else
                await _tokens.SendAccountConfirmation(user);

            var vm = new
            {
                errors = CollapseModelStateErrors(ModelState),
                accountState = new AccountState { RequiresEmailConfirmation = true }
            };
            return Redirect("/user/feedback"
                + $"?ViewModel={vm.ObjectToBase64UrlJson()}");
        }

        #endregion

        #region Account Approval

        private enum AccountApprovalOutcomes { Approved, Rejected }
        private async Task<IActionResult> AccountApprovalResult(AccountApprovalOutcomes outcome, string userId, string code)
        {
            var generalError = "The User ID or Token is invalid or has expired.";

            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code))
                ModelState.AddModelError(string.Empty, generalError);

            AccountState accountState = new();
            string Email = "";

            if (ModelState.IsValid)
            {
                code = code.Base64UrltoUtf8();

                var user = await _users.FindByIdAsync(userId);
                if (user is null)
                {
                    ModelState.AddModelError(string.Empty, generalError);
                }
                else
                {
                    Email = user.Email;

                    var result = await _users.VerifyUserTokenAsync(
                        user, "Default", TokenPurpose.AccountApproval, code);

                    if (!result)
                    {
                        ModelState.AddModelError(string.Empty, generalError);
                    }
                    else
                    {
                        // Update them with the outcome
                        switch (outcome)
                        {
                            case AccountApprovalOutcomes.Approved:
                                user.ApprovalDate = DateTimeOffset.UtcNow;
                                accountState.AccountApproved = true;
                                break;
                            case AccountApprovalOutcomes.Rejected:
                                user.RejectionDate = DateTimeOffset.UtcNow;
                                accountState.AccountRejected = true;
                                break;
                        }
                        await _users.UpdateAsync(user);

                        if (outcome == AccountApprovalOutcomes.Approved)
                        {
                            // Make them an admin
                            await _users.AddClaimAsync(user,
                                new Claim(ClaimTypes.Role, "survey.admin"));
                        }

                        // Email the user to notify them
                        await _emails.SendAccountApprovalResult(
                            new EmailAddress(user.Email) { Name = user.Fullname },
                            outcome == AccountApprovalOutcomes.Approved,
                            $"{Request.Scheme}://{Request.Host}/auth/login");
                    }
                }
            }

            var vm = new
            {
                Email,
                errors = CollapseModelStateErrors(ModelState),
                accountState,
                source = ViewModelSources.AccountApproval
            };

            return Redirect("/user/feedback"
                + $"?ViewModel={vm.ObjectToBase64UrlJson()}");
        }

        [HttpGet("approve/{userId}/{code}")]
        public async Task<IActionResult> Approve(string userId, string code)
            => await AccountApprovalResult(AccountApprovalOutcomes.Approved, userId, code);


        [HttpGet("reject/{userId}/{code}")]
        public async Task<IActionResult> Reject(string userId, string code)
            => await AccountApprovalResult(AccountApprovalOutcomes.Rejected, userId, code);

        #endregion
    }
}
