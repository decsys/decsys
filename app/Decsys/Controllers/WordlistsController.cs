using Microsoft.AspNetCore.Mvc;

namespace Decsys.Controllers;
public class WordlistsController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
