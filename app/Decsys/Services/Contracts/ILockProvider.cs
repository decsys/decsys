using System;
using System.Threading.Tasks;

namespace Decsys.Services.Contracts
{
    public interface ILockProvider
    {
        Task<IDisposable> AcquireLock(string resourceId);
    }
}
