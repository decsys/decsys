using Decsys.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/surveys/{id}/[controller]")]
    public class InstancesController : ControllerBase
    {
        private readonly SurveyInstanceService _instances;

        public InstancesController(SurveyInstanceService instances)
        {
            _instances = instances;
        }

        [HttpGet]
        public IActionResult List(int id)
        {
            try
            {
                return Ok(_instances.List(id));
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        [HttpGet("{instanceId}")]
        public IActionResult Get(int id, int instanceId)
        {
            try
            {
                return Ok(_instances.Get(id, instanceId));
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        [HttpPost]
        public IActionResult Create(int id)
        {
            try
            {
                var instanceId = _instances.Create(id);

                return Created(
                    Url.Action("Get", "Instances", new { id, instanceId }),
                    instanceId);
            }
            catch (KeyNotFoundException) { return NotFound(); }
            catch (ArgumentException e) { return BadRequest(e); }
        }
    }
}
