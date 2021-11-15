
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Razor;

using UoN.AspNetCore.RazorViewRenderer;

namespace Decsys.Services.EmailServices
{
    public class RazorViewService
    {
        private readonly ActionContext _actionContext;
        private readonly IRazorViewEngine _razor;
        private readonly IRazorViewRenderer _renderer;

        public RazorViewService(IActionContextAccessor actionContextAccessor, IRazorViewEngine razor, IRazorViewRenderer renderer)
        {
            _actionContext = actionContextAccessor.ActionContext ?? throw new InvalidOperationException("Failed to get the ActionContext.");
            _razor = razor;
            _renderer = renderer;
        }

        public async Task<string> ViewAsString(string view, object? model = null)
            => await _renderer.AsString(view, model);

        public bool ViewExists(string view)
            => _razor.FindView(_actionContext, view, false) is { };
    }
}
