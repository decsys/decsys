using System;
using Decsys.Data.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace Decsys.Repositories.Contracts
{
    interface IComponentRepository
    { 
        Component Create(int id, Guid pageId, string type);
        void Move(int id, Guid pageId, Guid componentId, int targetPosition);
        void ClearParam(int id, Guid pageId, Guid componentId, string paramKey);
        bool Delete(int id, Guid pageId, Guid componentId);
        void MergeParams(int id, Guid pageId, Guid componentId, JObject componentParams);
        Component Duplicate(int id, Guid pageId, Guid componentId);
    }
}
