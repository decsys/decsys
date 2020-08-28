using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Decsys.Services.Contracts
{
    public interface IImageService
    {
        Task CopyAllSurveyImages(int oldId, int newId);
        Task CopyImage(int surveyId, Guid pageId, Guid srcId, Guid destId);
        Task<IEnumerable<string>> Enumerate(int surveyId);
        Task<bool> HasImages(int surveyId);
        Task Import(int id, List<(string filename, byte[] data)> images);
        // TODO: Export
        Task RemoveAllSurveyImages(int id);
        Task RemoveImage(int surveyId, Guid pageId, Guid componentId);
        Task StoreImage(int surveyId, Guid componentId, (string extension, byte[] bytes) file);
    }
}
