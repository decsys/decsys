using System;
using System.Collections.Generic;
using Decsys.Models;
using Decsys.Services;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

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
        [SwaggerOperation("Add a new Page to a Survey.")]
        [SwaggerResponse(200, "The Page was added successfully.", typeof(NewPage))]
        [SwaggerResponse(400, "The provided Page has invalid Order value.")]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        public IActionResult Create(
            [SwaggerParameter("ID of the Survey to add a Page to.")]
            int id,
            [SwaggerParameter("The Page to add.")]
            NewPage page)
        {
            try
            {
                return Ok(_pages.Create(id, page));
            }
            catch (ArgumentOutOfRangeException e)
            {
                return BadRequest(e);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{pageId}")]
        [SwaggerOperation("Delete a Page from a Survey.")]
        [SwaggerResponse(204, "The Page was deleted successfully.")]
        [SwaggerResponse(404, "No Page, or Survey, was found with the provided ID.")]
        [SwaggerResponse(400, "The Page requested to delete is a Welcome or ThankYou page.")]
        public IActionResult Delete(int id, Guid pageId)
        {
            try
            {
                return _pages.Delete(id, pageId)
                    ? (ActionResult)NoContent()
                    : NotFound();
            }
            catch (ArgumentException e)
            {
                return BadRequest(e);
            }
        }

        [HttpPut("{pageId}/order")]
        public IActionResult Move(int id, int pageId, [FromBody]int targetPosition) => throw new NotImplementedException();

        [HttpPatch("{pageId}/params")]
        public IActionResult EditParams() => throw new NotImplementedException();
    }
}
