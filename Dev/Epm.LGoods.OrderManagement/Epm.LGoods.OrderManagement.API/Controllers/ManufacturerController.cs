using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Application.Services;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.IdentityService.Core.Entities;
using Newtonsoft.Json;
using System.Net.Http;

namespace Epm.LGoods.OrderManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManufacturerController : ControllerBase
    {
        private readonly IManufacturerService _manufacturerService;
        private readonly ILogger<ManufacturerController> _logger;
        private readonly HttpClient _httpClient;

        public ManufacturerController(IManufacturerService manufacturerService, ILogger<ManufacturerController> logger, HttpClient httpClient)
        {
            _manufacturerService = manufacturerService;
            _logger = logger;
            _httpClient = httpClient;
        }

        // GET: api/manufacturer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ManufacturerDTO>>> Get()
        {
            try
            {
                var manufacturers = await _manufacturerService.GetAllAsync();
                return Ok(manufacturers);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/manufacturer/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ManufacturerDTO>> Get(int id)
        {
            try
            {
                var manufacturer = await _manufacturerService.GetByIdAsync(id);
                if (manufacturer == null)
                    return NotFound();
                return Ok(manufacturer);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/manufacturer
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ManufacturerDTO manufacturerDTO)
        {
            if (manufacturerDTO == null)
                return BadRequest("Manufacturer data is null.");

            try
            {
                await _manufacturerService.AddAsync(manufacturerDTO);
                return CreatedAtAction(nameof(Get), new { id = manufacturerDTO.ManufacturerId }, manufacturerDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while saving the manufacturer.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // DELETE: api/manufacturer/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var manufacturer = await _manufacturerService.GetByIdAsync(id);
                if (manufacturer == null)
                    return NotFound();

                await _manufacturerService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/manufacturer/vendors
        [HttpGet("vendors")]
        public async Task<ActionResult<IEnumerable<VendorDetails>>> GetAllVendorsAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("http://localhost:5298/api/AdminVendorApproval/pending");
                if (!response.IsSuccessStatusCode)
                {
                    var errorMessage = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException($"Request failed with status code {response.StatusCode}. Error: {errorMessage}");
                }

                var json = await response.Content.ReadAsStringAsync();
                var vendors = JsonConvert.DeserializeObject<IEnumerable<VendorDetails>>(json);

                return Ok(vendors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching vendor details.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
