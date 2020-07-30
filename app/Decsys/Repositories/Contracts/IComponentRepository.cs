using System;
using Decsys.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;


namespace Decsys.Repositories.Contracts
{
    public interface IComponentRepository
    {
        Data.Entities.Survey Get(int id);
        void Update(Data.Entities.Survey survey);
    }
}
