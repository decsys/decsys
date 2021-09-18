using Decsys.Config;
using Decsys.Constants;

using Microsoft.Extensions.Options;

using MongoDB.Driver;

using System;
using System.Threading.Tasks;

namespace Decsys.Services.LockProvider
{
    public class MongoLockProvider
    {
        private readonly IMongoCollection<LockModel> _locks;

        public MongoLockProvider(IOptions<HostedDbSettings> config, IMongoClient mongo)
        {
            var db = mongo.GetDatabase(config.Value.DatabaseName);
            _locks = db.GetCollection<LockModel>(Collections.Surveys);
        }

        public async Task<IDisposable> AcquireLock(string resourceId)
        {
            // Determine the id of the lock
            var lockId = $"lock_{resourceId}";

            var distributedLock = new DistributedLock(_locks, lockId);

            var startLockAcquireTime = DateTimeOffset.UtcNow;

            // Try and acquire the lock
            while (!await distributedLock.AttemptGetLock())
            {
                // If we failed to acquire the lock, wait a moment.
                await Task.Delay(100);

                // Only try to acquire the lock for 20 seconds
                if ((DateTimeOffset.UtcNow - startLockAcquireTime).TotalSeconds > 20) // TODO: parameterise
                {
                    throw new ApplicationException($"Could not acquire lock for {resourceId} within the timeout.");
                }
            }

            // This will only return if we have the lock.
            return distributedLock;
        }
    }

    public class LockModel
    {
        public string Id { get; set; } = string.Empty;
    }

    public class DistributedLock : IDisposable
    {
        private readonly IMongoCollection<LockModel> _locks;
        private readonly string _lockId;

        public DistributedLock(IMongoCollection<LockModel> locks, string lockId)
        {
            _locks = locks;
            _lockId = lockId;
        }

        public async Task<bool> AttemptGetLock()
        {
            try
            {
                var response = await _locks.FindOneAndUpdateAsync<LockModel>(
                  // Find a record with the lock ID
                  x => x.Id == _lockId,
                  // If our 'upsert' creates a document, set the ID to the lock ID
                  Builders<LockModel>.Update.SetOnInsert(x => x.Id, _lockId),
                  new FindOneAndUpdateOptions<LockModel>
                  {
                  // If the record doesn't exist, create it.
                  IsUpsert = true,
                  // Specifies that the result we want is the record BEFORE it
                  // was created (this is important).
                  ReturnDocument = ReturnDocument.Before
                  });

                // If the result of the FindOneAndUpdateAsync is null, then that means there was no record 
                // before we ran our statement, so we now have the lock.
                // If the result is not null, then it means a document for the lock already existed, so someone else has the lock.
                if (response == null)
                {
                    return true;
                }

                return false;
            }
            catch (MongoCommandException e)
            {
                // 11000 == MongoDB Duplicate Key error
                if (e.Code == 11000)
                {
                    // Two threads have tried to acquire a lock at the exact same moment on the same key, 
                    // which will cause a duplicate key exception in MongoDB.
                    // So this thread failed to acquire the lock.
                    return false;
                }

                throw;
            }
        }

        public void Dispose()
        {
            // Delete the document with the specified lock ID, effectively releasing the lock.
            _locks.DeleteOne(x => x.Id == _lockId);
        }
    }
}
