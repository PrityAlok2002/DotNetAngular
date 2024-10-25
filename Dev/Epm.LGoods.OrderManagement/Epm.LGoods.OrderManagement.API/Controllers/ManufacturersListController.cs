using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Epm.LGoods.OrderManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManufacturersListController : ControllerBase
    {
       private readonly IManufacturerListService _manufacturerService;

        public ManufacturersListController(IManufacturerListService manufacturerService)
        {
            _manufacturerService = manufacturerService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ManufacturerListDto>>> GetAllManufacturers()
        {
            var manufacturers = await _manufacturerService.GetAllManufacturersAsync();
            return Ok(manufacturers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ManufacturerListDto>> GetManufacturerById(int id)
        {
            var manufacturer = await _manufacturerService.GetManufacturerByIdAsync(id);
            if (manufacturer == null)
                return NotFound();
            return Ok(manufacturer);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ManufacturerListDto>> UpdateManufacturer(int id, [FromBody] ManufacturerListDto manufacturerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedManufacturer = await _manufacturerService.UpdateManufacturerAsync(id, manufacturerDto);
            if (updatedManufacturer == null)
                return NotFound();

            return Ok(updatedManufacturer);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteManufacturer(int id)
        {
            var deleted = await _manufacturerService.DeleteManufacturerAsync(id);
            if (!deleted)
                return NotFound();

            return Ok(deleted);
        }
    }
}
