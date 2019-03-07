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
        [SwaggerOperation("Set the Order of a Page in a Survey.")]
        [SwaggerResponse(204, "The Page was moved successfully.")]
        [SwaggerResponse(404, "No Page, or Survey, was found with the provided ID.")]
        [SwaggerResponse(400,
            "The Page requested to move is a Welcome or ThankYou page, " +
            "or the requested new Order is unsuitable (i.e. First or Last).")]
        public IActionResult Move(int id, Guid pageId, [FromBody]int targetPosition)
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
            catch (Exception e) when (e is ArgumentException || e is ArgumentOutOfRangeException)
            {
                return BadRequest(e);
            }
        }

        [HttpPatch("{pageId}/params")]
        public IActionResult EditParams(int id, Guid pageId) => throw new NotImplementedException();
    }
}
