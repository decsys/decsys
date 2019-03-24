using System;
using System.Collections.Generic;
using Decsys.Models;
using Decsys.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
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
        [SwaggerResponse(200, "The Page was added successfully.", typeof(Page))]
        [SwaggerResponse(400, "The provided Page has invalid Order value.")]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        public IActionResult Create(
            [SwaggerParameter("ID of the Survey to add a Page to.")]
            int id)
        {
            try
            {
                return Ok(_pages.Create(id));
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
        public IActionResult Delete(
            [SwaggerParameter("ID of the Survey to delete a Page from.")]
            int id,
            [SwaggerParameter("ID of the Page to delete.")]
            Guid pageId)
            => _pages.Delete(id, pageId)
                ? (ActionResult)NoContent()
                : NotFound();



        [HttpPut("{pageId}/order")]
        [SwaggerOperation("Set the Order of a Page in a Survey.")]
        [SwaggerResponse(204, "The Page was moved successfully.")]
        [SwaggerResponse(404, "No Page, or Survey, was found with the provided ID.")]
        public IActionResult Move(
            [SwaggerParameter("ID of the Survey to change the Page in.")]
            int id,
            [SwaggerParameter("ID of the Page to change the order of.")]
            Guid pageId,
            [FromBody]
            [SwaggerParameter("The new order value for the Page.")]
            int targetPosition)
        {
            try
            {
                _pages.Move(id, pageId, targetPosition);
                return NoContent();
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost("{pageId}/duplicate")]
        [SwaggerOperation("Duplicates a Page in a Survey.")]
        [SwaggerResponse(200, "The Page was duplicated successfully and the new page is returned.", Type = typeof(Page))]
        [SwaggerResponse(404, "No Page, or Survey, was found with the provided ID.")]
        public IActionResult Duplicate(
            [SwaggerParameter("ID of the Survey to duplicate the Page in.")]
            int id,
            [SwaggerParameter("ID of the Page to duplicate.")]
            Guid pageId)
        {
            try
            {
                return Ok(_pages.Duplicate(id, pageId));
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }
    }
}
