using Decsys.Models;

using System.Collections.Generic;

namespace Decsys.Repositories.Contracts
{
    public interface ISurveyInstanceRepository
    {
        /// <summary>
        /// Check if a Survey has an active Instance
        /// </summary>
        /// <param name="surveyId">ID of the Survey to check</param>
        bool HasActiveInstance(int surveyId);

        /// <summary>
        /// Create a new Instance from a provided model
        /// </summary>
        /// <param name="instance">Instance model to create from</param>
        int Create(SurveyInstance instance);

        /// <summary>
        /// Find a SurveyInstance
        /// </summary>
        /// <param name="id">ID of the Instance to find</param>
        SurveyInstance Find(int id);

        /// <summary>
        /// List all the Instances belonging to a Survey
        /// </summary>
        /// <param name="surveyId">ID of the Survey to list Instances of</param>
        IEnumerable<SurveyInstance> List(int surveyId);

        /// <summary>
        /// Close a SurveyInstance
        /// </summary>
        /// <param name="instanceId">ID of the Instance to close</param>
        void Close(int instanceId);
    }
}
