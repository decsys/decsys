using System;
using Decsys.Data.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Decsys.Repositories.Contracts
{
    interface IPageRepository
    {
        Page Create(int id);
        void Move(int id, Guid pageId, int targetPosition);
        bool Delete(int id, Guid pageId);
        Page Duplicate(int id, Guid pageId);
        void SetRandomized(int id, Guid pageId, bool randomize);

    }
}
