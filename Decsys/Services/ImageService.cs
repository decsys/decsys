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

        public async Task WriteFile(int surveyId, Guid componentId, (string extension, byte[] bytes) file)
        {
            var filename = $"{componentId}{file.extension}";

            var dir = Path.Combine(_imagesPath, surveyId.ToString());

            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

            var path = Path.Combine(dir, filename);

            using (var stream = new FileStream(path, System.IO.FileMode.Create))
            {
                await stream.WriteAsync(file.bytes, 0, file.bytes.Length);
            }
        }

        public void RemoveFile(int surveyId, Guid pageId, Guid componentId)
        {
            var extension = GetStoredFileExtension(surveyId, pageId, componentId);
            if (extension is null) return; // no image currently stored; job done

            var path = Path.Combine(
                _imagesPath, surveyId.ToString(),
                componentId.ToString() + extension);

            if (File.Exists(path)) File.Delete(path);
        }

        public void RemoveAllSurveyFiles(int id)
        {
            var path = Path.Combine(_imagesPath, id.ToString());

            if (!Directory.Exists(path)) return;

            Directory.Delete(path, true);
        }

        public void CopyFile(int surveyId, Guid pageId, Guid srcId, Guid destId)
        {
            var extension = GetStoredFileExtension(surveyId, pageId, srcId);
            if (extension is null) return; // For whatever reason, an image item with no image has been duplicated

            var path = Path.Combine(
                _imagesPath, surveyId.ToString(), srcId.ToString() + extension);

            if (File.Exists(path)) File.Copy(path, Path.Combine(
                _imagesPath, surveyId.ToString(), destId.ToString() + extension));
        }

        public void CopyAllSurveyFiles(int oldId, int newId)
        {
            var src = Path.Combine(_imagesPath, oldId.ToString());
            var dest = Path.Combine(_imagesPath, newId.ToString());

            if (!Directory.Exists(src)) return;

            Directory.CreateDirectory(dest);
            foreach (var f in Directory.EnumerateFiles(src))
                File.Copy(f, Path.Combine(dest, Path.GetFileName(f)));
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
