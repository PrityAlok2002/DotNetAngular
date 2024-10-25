using Epm.LGoods.OrderManagement.Application.Services;
using Epm.LGoods.OrderManagement.Core.Entities;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Epm.LGoods.OrderManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var inventory = await _inventoryService.GetByIdAsync(id);
            if (inventory == null) return NotFound();
            return Ok(inventory);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var inventories = await _inventoryService.GetAllAsync();
            return Ok(inventories);
        }

        [HttpPost("update")]
        public async Task<IActionResult> Create([FromBody] Inventory inventory)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await _inventoryService.AddAsync(inventory);
            return CreatedAtAction(nameof(GetById), new { id = inventory.InventoryId }, inventory);
        }

       

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var inventory = await _inventoryService.GetByIdAsync(id);
            if (inventory == null) return NotFound();

            await _inventoryService.DeleteAsync(id);
            return NoContent();
        }
    }
}