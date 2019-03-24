using Decsys.Data;
using Decsys.Data.Entities;
using LiteDB;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Decsys.Services
{
    public class ImageService
    {
        private readonly string _imagesPath;
        private readonly LiteDatabase _db;

        public ImageService(string imagesPath, LiteDatabase db)
        {
            _imagesPath = imagesPath;
            _db = db;
        }

        public async Task WriteFile(Guid componentId, (string extension, byte[] bytes) file)
        {
            var filename = $"{componentId}{file.extension}";

            if (!Directory.Exists(_imagesPath)) Directory.CreateDirectory(_imagesPath);

            var path = Path.Combine(_imagesPath, filename);

            using (var stream = new FileStream(path, System.IO.FileMode.Create))
            {
                await stream.WriteAsync(file.bytes, 0, file.bytes.Length);
            }
        }

        public void RemoveFile(int surveyId, Guid pageId, Guid componentId)
        {
            var extension = GetStoredFileExtension(surveyId, pageId, componentId);

            var path = Path.Combine(
                _imagesPath,
                componentId.ToString(),
                extension);

            if (File.Exists(path)) File.Delete(path);
        }

        public void CopyFile(int surveyId, Guid pageId, Guid srcId, Guid destId)
        {
            var extension = GetStoredFileExtension(surveyId, pageId, srcId);

            var path = Path.Combine(
                _imagesPath, srcId.ToString(), extension);

            if (File.Exists(path)) File.Copy(path, Path.Combine(
                _imagesPath, destId.ToString(), extension));
        }

        private string GetStoredFileExtension(int surveyId, Guid pageId, Guid componentId)
        {
            var surveys = _db.GetCollection<Survey>(Collections.Surveys);
            var survey = surveys.FindById(surveyId)
                ?? throw new KeyNotFoundException("Survey could not be found.");

            var page = survey.Pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException("Page could not be found.");

            var component = page.Components.SingleOrDefault(x => x.Id == componentId)
                ?? throw new KeyNotFoundException("Page could not be found."); ;

            return component.Params["extension"].AsString;
        }
    }
}
