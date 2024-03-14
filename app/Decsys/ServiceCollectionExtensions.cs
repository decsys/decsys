using AspNetCore.Identity.Mongo.Model;
using AspNetCore.Identity.Mongo.Stores;

using Decsys.Auth;
using Decsys.Config;
using Decsys.Constants;
using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Repositories.Contracts;
using Decsys.Repositories.LiteDb;
using Decsys.Repositories.Mongo;
using Decsys.Services;
using Decsys.Services.Contracts;
using Decsys.Services.EmailSender;
using Decsys.Services.EmailServices;
using Decsys.Services.LockProvider;

using IdentityServer4.Models;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.FeatureManagement;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

using UoN.AspNetCore.RazorViewRenderer;
using UoN.VersionInformation.DependencyInjection;
using UoN.VersionInformation.Providers;

using static IdentityServer4.IdentityServerConstants;

namespace Decsys
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection ConfigureVersions(this IServiceCollection s, IConfiguration c)
        {
            foreach (var v in Versions.All)
            {
                s.Configure<ComponentTypeMap>(v,
                    o => c.GetSection($"ComponentTypeMaps:{v}")
                        .Bind(o.Types));
            }

            return s;
        }

        public static IServiceCollection AddEmailSender(this IServiceCollection s, IConfiguration c)
        {
            var emailProvider = c["Hosted:OutboundEmail:Provider"] ?? string.Empty;

            var useSendGrid = emailProvider.Equals("sendgrid", StringComparison.InvariantCultureIgnoreCase);

            if (useSendGrid) s.Configure<SendGridOptions>(c.GetSection("Hosted:OutboundEmail"));
            else s.Configure<LocalDiskEmailOptions>(c.GetSection("Hosted:OutboundEmail"));

            s
                    .AddTransient<TokenIssuingService>()
                    .AddTransient<IRazorViewRenderer, RazorViewRenderer>()
                    .AddTransient<RazorViewService>()
                    .AddTransient<AccountEmailService>()
                    .TryAddSingleton<IActionContextAccessor, ActionContextAccessor>();

            if (useSendGrid) s.AddTransient<IEmailSender, SendGridEmailSender>();
            else s.AddTransient<IEmailSender, LocalDiskEmailSender>();

            return s;
        }

        public static IServiceCollection AddLiteDb(this IServiceCollection s)
            => s.AddSingleton<LiteDbFactory>()
                .AddTransient<ILockProvider, MemoryCacheLockProvider>()
                .AddTransient<ISurveyRepository, LiteDbSurveyRepository>()
                .AddTransient<IPageRepository, LiteDbPageRepository>()
                .AddTransient<IComponentRepository, LiteDbComponentRepository>()
                .AddTransient<ISurveyInstanceRepository, LiteDbSurveyInstanceRepository>()
                .AddTransient<IParticipantEventRepository, LiteDbParticipantEventRepository>()
                .AddTransient<IStudyInstanceRepository, LiteDbStudyInstanceRepository>()
                .AddTransient<IWebhookRepository, LiteDbWebhookRepository>()
                .AddTransient<IWordlistRepository, LiteDbWordlistRepository>();

        public static IServiceCollection AddAppServices(this IServiceCollection s)
            => s.AddTransient<SurveyService>()
                .AddTransient<PageService>()
                .AddTransient<ComponentService>()
                .AddTransient<ComponentFileService>()
                .AddTransient<SurveyInstanceService>()
                .AddTransient<ExportService>()
                .AddTransient<ParticipantEventService>()
                .AddTransient<StudyAllocationService>()
                .AddTransient<WebhookService>()
                .AddTransient<WordlistService>()
                .AddSingleton<MathService>();
            

        public static IServiceCollection AddAppMvcServices(this IServiceCollection s)
        {
            s.AddRazorPages();

            // wrap these cos they don't return an ISC, interrupting chaining
            s.AddControllersWithViews()

            // we used JSON.NET back in .NET Core 2.x
            // for ViewModel Property shenanigans so component params can be dynamic
            // it doesn't really make sense to change this
            // (if System.Text.Json even does what we need)
            .AddNewtonsoftJson();

            s.AddFeatureManagement();

            return s;
        }

        public static IServiceCollection AddAppAuthorization(this IServiceCollection s, AppMode mode)
            => s.AddAuthorization(opts =>
            {
                opts.AddPolicy(
                    nameof(AuthPolicies.IsAuthenticated),
                    AuthPolicies.IsAuthenticated);
                opts.AddPolicy(
                    nameof(AuthPolicies.IsSurveyAdmin),
                    AuthPolicies.IsSurveyAdmin(mode));
                opts.AddPolicy(
                    nameof(AuthPolicies.CanManageSurvey),
                    AuthPolicies.CanManageSurvey(mode));
            });

        public static IServiceCollection AddMongoDb(this IServiceCollection s, MongoClient mongoClient)
        {
            // Some mongo driver config for Identity Server
            if (BsonClassMap.IsClassMapRegistered(typeof(PersistedGrant)))
            {
                var map = BsonClassMap.LookupClassMap(typeof(PersistedGrant));
                map.AutoMap();
                map.SetIgnoreExtraElements(true);
                BsonClassMap.RegisterClassMap(map);
            }
            else
            {
                BsonClassMap.RegisterClassMap<PersistedGrant>(map =>
                {
                    map.AutoMap();
                    map.SetIgnoreExtraElements(true);
                });
            }

            return s.AddSingleton<IMongoClient, MongoClient>(_ => mongoClient)
                  .AddTransient<ILockProvider, MongoLockProvider>();
        }

        public static IServiceCollection AddAppIdentity(this IServiceCollection s, MongoClient mongoClient, HostedDbSettings dbSettings)
        {
            s.AddSingleton<IUserConfirmation<DecsysUser>, DecsysUserConfirmation>()

                .AddIdentityCore<DecsysUser>(opts =>
                    opts.SignIn.RequireConfirmedAccount = true)
                .AddRoles<MongoRole>()
                .AddRoleStore<RoleStore<MongoRole>>()
                .AddUserStore<UserStore<DecsysUser, MongoRole>>()
                .AddRoleManager<RoleManager<MongoRole>>()
                .AddUserManager<UserManager<DecsysUser>>()
                .AddSignInManager<SignInManager<DecsysUser>>()
                .AddClaimsPrincipalFactory<DecsysUserClaimsPrincipalFactory>()
                .AddDefaultTokenProviders();

            // Additional Mongo Identity Store setup
            var roleCollection = mongoClient
                .GetDatabase(dbSettings.DatabaseName)
                .GetCollection<MongoRole>(Collections.Roles);
            var userCollection = mongoClient
                .GetDatabase(dbSettings.DatabaseName)
                .GetCollection<DecsysUser>(Collections.Users);

            s.AddSingleton(_ => roleCollection)
                .AddSingleton(_ => userCollection)

                .AddTransient<IRoleStore<MongoRole>>(_ => new RoleStore<MongoRole>(roleCollection))
                .AddTransient<IUserStore<DecsysUser>>(x =>
                    new UserStore<DecsysUser, MongoRole>(
                        userCollection,
                        new RoleStore<MongoRole>(roleCollection),
                        x.GetService<ILookupNormalizer>()));

            return s;
        }

        public static IServiceCollection AddAppIdentityServer(
            this IServiceCollection s,
            IConfiguration c,
            IWebHostEnvironment env)
        {
            var idsBuilder = s
                .AddIdentityServer(opts => opts.UserInteraction.ErrorUrl = "/error")
                .AddInMemoryIdentityResources(IdentityServerConfig.IdentityResources)
                .AddInMemoryApiScopes(IdentityServerConfig.ApiScopes)
                .AddInMemoryClients(IdentityServerConfig.Clients(c["Hosted:Origin"]))
                .AddPersistedGrantStore<MongoPersistedGrantStore>()
                .AddAspNetIdentity<DecsysUser>();

            // Sort out Signing Keys
            if (env.IsDevelopment())
                idsBuilder.AddDeveloperSigningCredential();
            else idsBuilder.AddSigningCredential(RsaKeyService.GetRsaKey(c), RsaSigningAlgorithm.RS256);

            return s;
        }

        public static IServiceCollection AddAppAuthentication(this IServiceCollection s, IConfiguration c)
        {
            s.AddAuthentication()
                .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, opts =>
                {
                    opts.Authority = c["Hosted:Origin"];
                    opts.TokenValidationParameters = new()
                    {
                        ValidateAudience = false
                    };
                })
                .AddIdentityCookies(opts =>
                    opts.ApplicationCookie?.Configure(
                        config => config.LoginPath = "/auth/login"));
            return s;
        }

        public static IServiceCollection AddMongoDbRepositories(this IServiceCollection s)
            => s.AddTransient<ISurveyRepository, SurveyRepository>()
                .AddTransient<IPageRepository, PageRepository>()
                .AddTransient<IComponentRepository, ComponentRepository>()
                .AddTransient<ISurveyInstanceRepository, SurveyInstanceRepository>()
                .AddTransient<IParticipantEventRepository, ParticipantEventRepository>()
                .AddTransient<IStudyInstanceRepository, StudyInstanceRepository>()
                .AddTransient<IWebhookRepository, WebhookRepository>()
                .AddTransient<IWordlistRepository, WordlistRepository>();

    }
}
