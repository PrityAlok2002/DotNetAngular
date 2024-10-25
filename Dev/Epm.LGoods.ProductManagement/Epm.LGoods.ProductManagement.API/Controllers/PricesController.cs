using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Services;
using Microsoft.AspNetCore.Mvc;


namespace Epm.LGoods.ProductManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PricesController : ControllerBase
    {
        private readonly IPriceService _priceService;

        public PricesController(IPriceService priceService)
        {
            _priceService = priceService;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePrice([FromBody] PriceDto priceDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _priceService.AddPriceAsync(priceDto);
            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPriceById(int id)
        {
            var price = await _priceService.GetPriceByIdAsync(id);
            if (price == null)
            {
                return NotFound();
            }
            return Ok(price);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePrice(int id, [FromBody] PriceDto priceDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _priceService.UpdatePriceAsync(id, priceDto);
            return Ok();
        }


    }
}
