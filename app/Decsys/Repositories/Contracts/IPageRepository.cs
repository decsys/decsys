using System;
using Decsys.Models;
using Decsys.Data.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Decsys.Repositories.Contracts
{
    public interface IPageRepository
    {
        Data.Entities.Survey Get(int id);
        void Update(Data.Entities.Survey survey);

    }
}
