using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Razor;
using UoN.AspNetCore.RazorViewRenderer;

namespace Decsys.Services.EmailServices
{
    public class RazorViewService
    {
        private readonly IActionContextAccessor _actionContextAccessor;
        private readonly IRazorViewEngine _razor;
        private readonly IRazorViewRenderer _renderer;

        public RazorViewService(IActionContextAccessor actionContextAccessor, IRazorViewEngine razor, IRazorViewRenderer renderer)
        {
            _actionContextAccessor = actionContextAccessor;
            _razor = razor;
            _renderer = renderer;
        }

        public async Task<string> ViewAsString(string view, object? model = null)
            => await _renderer.AsString(view, model);

        public bool ViewExists(string view)
            => _razor.FindView(_actionContextAccessor.ActionContext, view, false) is { };
    }
}
