using System;
using System.IO;
using System.Threading.Tasks;

namespace Decsys.Services
{
    public class ImageService
    {
        private readonly string _imagesPath;

        public ImageService(string imagesPath)
        {
            _imagesPath = imagesPath;
        }

        public async Task WriteFile(Guid componentId, (string extension, byte[] bytes) file) //?
        {
            var filename = $"{componentId}{file.extension}";

            if (!Directory.Exists(_imagesPath)) Directory.CreateDirectory(_imagesPath);

            var path = Path.Combine(_imagesPath, filename);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await stream.WriteAsync(file.bytes, 0, file.bytes.Length);
            }
        }

        public void RemoveFile(Guid componentId, string extension)
        {
            var path = Path.Combine(
                _imagesPath, componentId.ToString(), extension);

            if (File.Exists(path)) File.Delete(path);
        }

        public void CopyFile(Guid srcId, Guid destId, string extension)
        {
            var path = Path.Combine(
                _imagesPath, srcId.ToString(), extension);

            if (File.Exists(path)) File.Copy(path, Path.Combine(
                _imagesPath, destId.ToString(), extension));
        }
    }
}
