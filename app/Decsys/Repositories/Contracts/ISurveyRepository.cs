using Decsys.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Decsys.Repositories.Contracts
{
    public interface ISurveyRepository
    {

        Survey Get(int id);
        int Create(string? name = null);
        int Duplicate(int id);
        Task<int> Import(Survey survey, List<(string filename, byte[] data)> images);
        void Delete(int id);
        void EditName(int id, string name);
        void Configure(int id, ConfigureSurveyModel config);


    }
}
 