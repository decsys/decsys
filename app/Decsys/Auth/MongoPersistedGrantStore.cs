using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Decsys.Config;
using Decsys.Constants;
using IdentityServer4.Models;
using IdentityServer4.Stores;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Decsys.Auth
{
    public class MongoPersistedGrantStore : IPersistedGrantStore
    {
        private readonly IMongoCollection<PersistedGrant> _grants;

        public MongoPersistedGrantStore(
            IOptions<HostedDbSettings> config,
            IMongoClient mongo)
        {
            _grants = mongo.GetDatabase(config.Value.DatabaseName)
                .GetCollection<PersistedGrant>(Collections.Grants);
        }

        private static bool IsNullWhitespaceOrEqual(string? input, string compare)
            => string.IsNullOrWhiteSpace(input) || input == compare;

        private static Expression<Func<PersistedGrant,bool>> FilterPredicate(PersistedGrantFilter filter)
            => x =>
                IsNullWhitespaceOrEqual(filter.SessionId, x.SessionId) &&
                IsNullWhitespaceOrEqual(filter.SubjectId, x.SubjectId) &&
                IsNullWhitespaceOrEqual(filter.ClientId, x.ClientId) &&
                IsNullWhitespaceOrEqual(filter.Type, x.Type);

        public async Task<IEnumerable<PersistedGrant>> GetAllAsync(PersistedGrantFilter filter)
            => await (await _grants.FindAsync(FilterPredicate(filter)))
                .ToListAsync();

        public async Task<PersistedGrant> GetAsync(string key)
            => await (await _grants.FindAsync(x => x.Key == key)).SingleAsync();

        public async Task RemoveAllAsync(PersistedGrantFilter filter)
            => await _grants.DeleteManyAsync(FilterPredicate(filter));

        public async Task RemoveAsync(string key)
            => await _grants.DeleteOneAsync(x => x.Key == key);

        public async Task StoreAsync(PersistedGrant grant)
            => await _grants.InsertOneAsync(grant);
    }
}
