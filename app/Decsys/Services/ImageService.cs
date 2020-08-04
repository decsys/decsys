using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

using Decsys.Repositories.Contracts;

namespace Decsys.Services
{
    public class ImageService
    {
        private readonly IComponentRepository _components;

        public string ImagesPath { get; }

        public ImageService(string imagesPath, IComponentRepository components)
        {
            ImagesPath = imagesPath;
            _components = components;
        }

        public string SurveyImagesPath(int id) =>
            Path.Combine(ImagesPath, id.ToString());

        public async Task WriteFile(int surveyId, Guid componentId, (string extension, byte[] bytes) file)
        {
            var filename = $"{componentId}{file.extension}";

            var dir = SurveyImagesPath(surveyId);

            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

            var path = Path.Combine(dir, filename);

            using var stream = File.Create(path);
            await stream.WriteAsync(file.bytes, 0, file.bytes.Length);
        }

        public void RemoveFile(int surveyId, Guid pageId, Guid componentId)
        {
            var extension = GetStoredFileExtension(surveyId, pageId, componentId);
            if (extension is null) return; // no image currently stored; job done

            var path = Path.Combine(
                SurveyImagesPath(surveyId),
                componentId.ToString() + extension);

            if (File.Exists(path)) File.Delete(path);
        }

        public void RemoveAllSurveyFiles(int id)
        {
            var path = SurveyImagesPath(id);

            if (!Directory.Exists(path)) return;

            Directory.Delete(path, true);
        }

        public void CopyFile(int surveyId, Guid pageId, Guid srcId, Guid destId)
        {
            var extension = GetStoredFileExtension(surveyId, pageId, srcId);
            if (extension is null) return; // For whatever reason, an image item with no image has been duplicated

            var path = Path.Combine(
                SurveyImagesPath(surveyId), srcId.ToString() + extension);

            if (File.Exists(path))
            {
                File.Copy(path, Path.Combine(
                SurveyImagesPath(surveyId), destId.ToString() + extension));
            }
        }

        public void CopyAllSurveyFiles(int oldId, int newId)
        {
            var dest = SurveyImagesPath(newId); ;

            Directory.CreateDirectory(dest);
            foreach (var f in Enumerate(oldId))
                File.Copy(f, Path.Combine(dest, Path.GetFileName(f)));
        }

        public async Task Import(int id, List<(string filename, byte[] data)> images)
        {
            var dest = SurveyImagesPath(id);

            Directory.CreateDirectory(dest);
            foreach (var (filename, data) in images)
            {
                using var stream = File.Create(Path.Combine(dest, filename));
                await stream.WriteAsync(data, 0, data.Length).ConfigureAwait(false);
            }
        }

        public IEnumerable<string> Enumerate(int surveyId)
        {
            var dir = SurveyImagesPath(surveyId);
            return Directory.Exists(dir)
                ? Directory.EnumerateFiles(dir)
                : new List<string>();
        }

        public bool HasImages(int surveyId)
            => Enumerate(surveyId).Any();

        private string GetStoredFileExtension(int surveyId, Guid pageId, Guid componentId) =>
            _components.Find(surveyId, pageId, componentId)
                .Params.Value<string>("extension");

    }
}
