using Decsys.Services.Contracts;

using Microsoft.Extensions.Caching.Memory;

using System;
using System.Threading.Tasks;

namespace Decsys.Services.LockProvider
{
    public class MemoryCacheLockProvider : ILockProvider
    {
        private readonly IMemoryCache _cache;

        public MemoryCacheLockProvider(IMemoryCache cache)
        {
            _cache = cache;
        }

        public async Task<IDisposable> AcquireLock(string resourceId)
        {
            var lockId = $"lock_{resourceId}";

            var cacheLock = new MemoryCacheLock(lockId, _cache);

            var lockingStarted = DateTimeOffset.UtcNow;

            while(!await cacheLock.AttemptGetLock())
            {
                // If we failed to acquire the lock, wait a moment.
                await Task.Delay(100);

                // Only try to acquire the lock for 20 seconds
                if ((DateTimeOffset.UtcNow - lockingStarted).TotalSeconds > 20) // TODO: parameterise
                {
                    throw new ApplicationException($"Could not acquire lock for {resourceId} within the timeout.");
                }
            }

            // This will only return if we have the lock.
            return cacheLock;
        }
    }

    public class MemoryCacheLock : IDisposable
    {
        private readonly string _lockId;
        private readonly IMemoryCache _cache;

        public MemoryCacheLock(string lockId, IMemoryCache cache)
        {
            _lockId = lockId;
            _cache = cache;
        }

        public async Task<bool> AttemptGetLock()
        {
            var lockerId = Guid.NewGuid();

            var cacheLock = await _cache.GetOrCreateAsync(
                _lockId,
                _ => Task.FromResult(lockerId));

            return cacheLock == lockerId;
        }

        public void Dispose()
        {
            _cache.Remove(_lockId);
        }
    }
}
