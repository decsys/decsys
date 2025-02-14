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
using Decsys.Constants;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [AllowAnonymous]
    public class AccountController : ControllerBase
    {
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IEventService _events;
        private readonly SignInManager<DecsysUser> _signIn;
        private readonly UserManager<DecsysUser> _users;
        private readonly IConfiguration _config;
        private readonly TokenIssuingService _tokens;
        private readonly AccountEmailService _emails;
        private readonly bool _approvalRequired;

        public AccountController(
            IIdentityServerInteractionService interaction,
            IEventService events,
            UserManager<DecsysUser> users,
            SignInManager<DecsysUser> signIn,
            IConfiguration config,
            TokenIssuingService tokens,
            AccountEmailService emails)
        {
            _interaction = interaction;
            _events = events;
            _signIn = signIn;
            _users = users;
            _config = config;
            _tokens = tokens;
            _emails = emails;

            // shortcut some config
            _approvalRequired = _config.GetValue<bool>("Hosted:AccountApprovalRequired");
        }

        private static List<string> CollapseModelStateErrors(ModelStateDictionary modelState)
            => modelState.Keys
                .SelectMany(k => modelState[k]?.Errors
                    .Select(x => !string.IsNullOrWhiteSpace(k)
                        ? $"{k}: {x.ErrorMessage}"
                        : x.ErrorMessage) ?? new List<string>())
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
                    var url when Url.IsLocalUrl(url!) => Redirect(url),
                    _ => throw new InvalidOperationException("Invalid Return URL")
                };
            }

            AccountState accountState = new();
            if (ModelState.IsValid)
            {
                // Validate credentials
                var result = await _signIn.PasswordSignInAsync(model.Username, model.Password, false, true);

                var user = await _users.FindByNameAsync(model.Username);

                if (result.Succeeded)
                {
                    if (user != null)
                        await _events.RaiseAsync(new UserLoginSuccessEvent(
                            user.UserName,
                            user.Id.ToString(),
                            user.Fullname,
                            clientId: context?.Client.ClientId));

                    return model.ReturnUrl switch
                    {
                        var url when string.IsNullOrEmpty(url) => Redirect("~/"),
                        var url when Url.IsLocalUrl(url!) => Redirect(url), // we know it's not null here since it didn't match the pattern above
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

                    accountState = user switch
                    {
                        { EmailConfirmed: false }
                            => AccountState.RequiresEmailConfirmation,
                        { ApprovalDate: null, RejectionDate: null } when _approvalRequired
                            => AccountState.RequiresApproval,
                        { RejectionDate: { } } when _approvalRequired
                            => AccountState.Rejected,
                        { } => AccountState.Valid,
                        _ => AccountState.Unknown
                    };

                    if (accountState == AccountState.Rejected)
                        friendlyError = "This account has been rejected for approval.";

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
                ClientRoutes.LoginForm +
                $"?ReturnUrl={WebUtility.UrlEncode(model.ReturnUrl)}" +
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
        public async Task<IActionResult> Logout()
        {
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
                .Clients(_config["Hosted:Origin"]??"").Single()
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
                    return Redirect(ClientRoutes.UserFeedback("register", "confirmemail"));
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);

                    if (new[] { "DuplicateEmail", "DuplicateUserName" }.Contains(error.Code))
                    {
                        var existingUser = await _users.FindByEmailAsync(model.Email);

                        accountState = existingUser switch
                        {
                            { EmailConfirmed: false } => AccountState.RequiresEmailConfirmation,
                            { ApprovalDate: null, RejectionDate: null } when _approvalRequired
                                => AccountState.RequiresApproval,
                            { RejectionDate: { } } when _approvalRequired
                                => AccountState.Rejected,
                            _ => AccountState.Valid
                        };

                        if (accountState == AccountState.Rejected)
                            ModelState.AddModelError(string.Empty,
                                "This account registration has been rejected.");
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
                ClientRoutes.RegisterForm +
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

            (string category, string state) route = ("register", "error");
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
                        var accountState = user switch
                        {
                            { ApprovalDate: null, RejectionDate: null } when _approvalRequired
                                => AccountState.RequiresApproval,
                            { RejectionDate: { } } when _approvalRequired
                                => AccountState.Rejected,
                            _ => AccountState.Valid
                        };

                        switch (accountState)
                        {
                            case AccountState.RequiresApproval:
                                await _tokens.SendAccountApprovalRequest(user);
                                route = ("register", "approval");
                                break;
                            case AccountState.Rejected:
                                ModelState.AddModelError(string.Empty, "This account registration has been rejected.");
                                break;
                            default:
                                route = ("register", "complete");
                                // Make them an admin
                                await _users.AddClaimAsync(user,
                                    new Claim(ClaimTypes.Role, "survey.admin"));

                                // and sign them in!
                                await _signIn.SignInAsync(user, false);
                                break;
                        }
                    }
                }
            }

            var vm = new
            {
                errors = CollapseModelStateErrors(ModelState)
            };

            return Redirect(
                ClientRoutes.UserFeedback(route.category, route.state)
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
                errors = CollapseModelStateErrors(ModelState)
            };
            return Redirect(
                ClientRoutes.UserFeedback("register", "confirmemail")
                + $"?ViewModel={vm.ObjectToBase64UrlJson()}");
        }

        #endregion

        #region Account Approval

        private enum AccountApprovalOutcomes { Approved, Rejected }
        private async Task<IActionResult> AccountApprovalResult(AccountApprovalOutcomes outcome, string userId, string code)
        {
            var generalError = "The User ID or Token is invalid or has expired.";
            var tokenError = "The token has expired or is invalid. Please request a new approval email.";

            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code))
                ModelState.AddModelError(string.Empty, generalError);

            (string category, string state) route = ("approval", "error");
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
                    if (user.Email != null)
                    {
                        Email = user.Email;

                        var result = await _users.VerifyUserTokenAsync(
                            user, "Default", TokenPurpose.AccountApproval, code);
                        if (!result) 
                        {
                            ModelState.AddModelError(string.Empty, tokenError);
                            route = ("approval", "tokenexpired"); 
                        }
                        else
                        {
                            // Update them with the outcome
                            switch (outcome)
                            {
                                case AccountApprovalOutcomes.Approved:
                                    user.ApprovalDate = DateTimeOffset.UtcNow;
                                    route = ("approval", "approved");
                                    break;
                                case AccountApprovalOutcomes.Rejected:
                                    user.RejectionDate = DateTimeOffset.UtcNow;
                                    route = ("approval", "rejected");
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
                                new Models.Emails.EmailAddress(user.Email) { Name = user.Fullname },
                                outcome == AccountApprovalOutcomes.Approved,
                                ClientRoutes.LoginForm.ToLocalUrlString(Request));
                        }
                    }
                }
            }

            var vm = new
            {
                Email,
                errors = CollapseModelStateErrors(ModelState)
            };

            return Redirect(
             ClientRoutes.UserFeedback(route.category, route.state)
             + $"?userId={WebUtility.UrlEncode(userId)}"
             + $"&code={WebUtility.UrlEncode(code)}"
             + $"&ViewModel={vm.ObjectToBase64UrlJson()}");

        }

        [HttpGet("approve/{userId}/{code}")]
        public async Task<IActionResult> Approve(string userId, string code)
            => await AccountApprovalResult(AccountApprovalOutcomes.Approved, userId, code);


        [HttpGet("reject/{userId}/{code}")]
        public async Task<IActionResult> Reject(string userId, string code)
            => await AccountApprovalResult(AccountApprovalOutcomes.Rejected, userId, code);

        [HttpGet("approval/resend/{userId}")]
        public async Task<IActionResult> ResendApprovalEmail(string userId)
        {
            var user = await _users.FindByIdAsync(userId);
            if (user is null)
            {
                ModelState.AddModelError(string.Empty, "User not found.");
            }
            else
            {
                await _tokens.SendAccountApprovalRequest(user);
            }

            var vm = new
            {
                errors = CollapseModelStateErrors(ModelState)
            };

            return Redirect(
                ClientRoutes.UserFeedback("approval", "emailsent")
                + $"?ViewModel={vm.ObjectToBase64UrlJson()}");
        }
        #endregion

        #region Change / Reset Password

        [HttpPost("password/reset")]
        public async Task<IActionResult> RequestPasswordReset([FromForm] RequestPasswordResetModel model)
        {
            (string category, string state) route = ("password", "request");

            if (ModelState.IsValid)
            {
                switch (await _users.FindByEmailAsync(model.Email))
                {
                    case { EmailConfirmed: false }:
                        route = ("register", "confirmemail");
                        break;
                    case { ApprovalDate: null, RejectionDate: null } when _approvalRequired:
                        route = ("register", "approval");
                        break;
                    case { RejectionDate: { } } when _approvalRequired:
                        ModelState.AddModelError(string.Empty,
                            "This account registration has been rejected.");
                        break;
                    case { } user:
                        await _tokens.SendPasswordReset(user);
                        break;
                }
            }

            return Redirect(ClientRoutes.UserFeedback(
                route.category, route.state));
        }

        [HttpPost("password/{userId}/{code}")]
        public async Task<IActionResult> PasswordReset(
            string userId, string code,
            [FromForm] PasswordResetModel model)
        {
            code = code.Base64UrltoUtf8();

            await SetNewPassword(
                userId,
                model.Password,
                model.PasswordConfirm,
                code,
                useCode: true);

            var vm = new
            {
                errors = CollapseModelStateErrors(ModelState)
            };

            return Redirect(
                ClientRoutes.UserFeedback("password", "reset") +
                $"?ViewModel={vm.ObjectToBase64UrlJson()}");
        }

        [HttpPost("password")]
        [Authorize(Policy = nameof(AuthPolicies.IsAuthenticated))]
        public async Task<IActionResult> PasswordChange(ChangePasswordModel model)
        {
            var userId = User.GetUserId();

            await SetNewPassword(
                userId,
                model.Password,
                model.PasswordConfirm,
                model.CurrentPassword);

            return new JsonResult(new
            {
                errors = CollapseModelStateErrors(ModelState)
            });
        }

        /// <summary>
        /// Set a new Password for a User.
        /// 
        /// Authorize the action either with the user's current Password or a PasswordReset token.
        /// </summary>
        /// <param name="userId">ID of the User</param>
        /// <param name="password">The new Password</param>
        /// <param name="confirmPassword">The new Password</param>
        /// <param name="authorizer">The authorization value: either the current Password, or a PasswordReset token</param>
        /// <param name="useCode">Is the <paramref name="authorizer"/> a PasswordReset token code?</param>
        /// <returns></returns>
        private async Task SetNewPassword(
            string userId,
            string password,
            string confirmPassword,
            string authorizer,
            bool useCode = false)
        {
            var generalError = "The User ID or Token is invalid or has expired.";

            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(authorizer))
                ModelState.AddModelError(string.Empty, useCode ? generalError : "Incorrect current password.");

            if (ModelState.IsValid) // Perform additional Model validation
            {
                // Client side should catch these, but we should be on the safe side.
                if (password != confirmPassword)
                    ModelState.AddModelError(string.Empty, "The passwords entered do not match.");
            }

            if (ModelState.IsValid)
            {
                var user = await _users.FindByIdAsync(userId);
                if (user is null)
                {
                    ModelState.AddModelError(string.Empty, generalError);
                }
                else
                {
                    var result = useCode
                        ? await _users.ResetPasswordAsync(user, authorizer, password)
                        : await _users.ChangePasswordAsync(user, authorizer, password);

                    if (result.Errors.Any())
                    {
                        if (useCode)
                            ModelState.AddModelError(string.Empty, generalError);
                        else
                            foreach (var error in result.Errors)
                                ModelState.AddModelError(string.Empty, error.Description);
                    }
                }
            }
        }

        #endregion

        #region Edit Profile

        [HttpPost("profile")]
        [Authorize(Policy = nameof(AuthPolicies.IsAuthenticated))]
        public async Task<IActionResult> EditProfile(EditProfileModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _users.FindByIdAsync(User.GetUserId());
                if (user != null)
                {
                    user.Fullname = model.FullName;
                    var result = await _users.UpdateAsync(user);
                    if (result.Errors.Any())
                    {
                        foreach (var error in result.Errors)
                            ModelState.AddModelError(string.Empty, error.Description);
                    }
                }
            }

            return new JsonResult(new
            {
                errors = CollapseModelStateErrors(ModelState)
            });
        }

        #endregion

        #region Change Email Address

        // Change Email
        // For this one, we receive the POST submission, generate a token and send email
        // the confirmation link should include the new email address so we don't ahve to persist it anywhere
        // but base64 encode it or something :)
        // then AJAX return success (or fail)
        [HttpPost("email")]
        [Authorize(Policy = nameof(AuthPolicies.IsAuthenticated))]
        public async Task<IActionResult> RequestEmailChange(RequestEmailChangeModel model)
        {
            if (ModelState.IsValid) // Perform additional Model validation
            {
                // Client side should catch these, but we should be on the safe side.
                if (model.Email != model.EmailConfirm)
                    ModelState.AddModelError(string.Empty,
                        "The email addresses entered do not match.");
            }

            if (ModelState.IsValid)
            {
                var user = await _users.FindByIdAsync(User.GetUserId());
                var existingUser = await _users.FindByEmailAsync(model.Email);

                if (user == null)
                {
                    ModelState.AddModelError(string.Empty, "User not found.");
                }
                else if (existingUser == null)
                {
                    await _tokens.SendEmailChange(user, model.Email);
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "A User Account already exists with that email address");
                }
            }
            
            return new JsonResult(new
            {
                errors = CollapseModelStateErrors(ModelState)
            });
        }

        [HttpGet("email/{userId}/{code}/{b64NewEmail}")]
        public async Task<IActionResult> ConfirmEmailChange(string userId, string code, string b64NewEmail)
        {
            var generalError = "The User ID or Token is invalid or has expired.";

            if (new[] { userId, code, b64NewEmail }.Any(string.IsNullOrWhiteSpace))
                ModelState.AddModelError(string.Empty, generalError);

            if (ModelState.IsValid)
            {
                var user = await _users.FindByIdAsync(userId);
                if (user is null)
                {
                    ModelState.AddModelError(string.Empty, generalError);
                }
                else
                {
                    code = code.Base64UrltoUtf8();
                    var email = b64NewEmail.Base64UrltoUtf8();

                    var existingUser = await _users.FindByEmailAsync(email);
                    if (existingUser is { })
                        ModelState.AddModelError(string.Empty,
                            "A User Account already exists with that email address");
                    else
                    {

                        var emailResult = await _users.ChangeEmailAsync(user, email, code);
                        if (emailResult.Errors.Any())
                        {
                            ModelState.AddModelError(string.Empty, generalError);
                        }
                        else
                        {
                            var usernameResult = await _users.SetUserNameAsync(user, email);
                            if (usernameResult.Errors.Any())
                            {
                                ModelState.AddModelError(string.Empty, generalError);
                            }
                        }
                    }
                }
            }

            var vm = new
            {
                errors = CollapseModelStateErrors(ModelState)
            };

            return Redirect(
                ClientRoutes.UserFeedback("email", "changed")
                + $"?ViewModel={vm.ObjectToBase64UrlJson()}");
        }

        #endregion
    }
}
