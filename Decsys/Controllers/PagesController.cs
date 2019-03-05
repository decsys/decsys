using System;
using System.Collections.Generic;
using Decsys.Models;
using Decsys.Services;
using Microsoft.AspNetCore.Mvc;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/surveys/{id}/pages")]
    public class PagesController : ControllerBase
    {
        private readonly PageService _pages;

        public PagesController(PageService pages)
        {
            _pages = pages;
        }

        [HttpPost]
        public IActionResult Create(int id, Page page)
        {
            try
            {
                _pages.Create(id, page);
            }
            catch (ArgumentOutOfRangeException e)
            {
                return BadRequest(e);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }


    }
}
