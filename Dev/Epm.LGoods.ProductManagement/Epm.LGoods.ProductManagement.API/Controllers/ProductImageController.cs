using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Epm.LGoods.ProductManagement.API.Controllers
{
    [Route("api/products/[controller]")]
    [ApiController]
    public class ProductImageController : ControllerBase
    {
        private readonly IProductImageService _productImageService;

        private readonly List<string> AllowedFileTypes = new List<string> { "image/jpeg", "image/png" };

        public ProductImageController(IProductImageService productImageService)
        {
            _productImageService = productImageService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductImage>>> GetAllProductImages()
        {
            try
            {
                return Ok(await _productImageService.GetAllProductImagesAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost()]
        public async Task<IActionResult> SaveSelectedImages([FromForm] int productId, [FromForm] List<string> imageUrls, [FromForm] List<IFormFile> files, [FromForm] string isMain)
        {
            if (files.Count == 0 && imageUrls.Count == 0)
            {
                return BadRequest("No files selected.");
            }
            foreach (var file in files)
            {
                if (file.Length > 2 * 1024 * 1024)
                {
                    return BadRequest($"File {file.FileName} is too large. Please select a file smaller than 2MB.");
                }

                if (!AllowedFileTypes.Contains(file.ContentType))
                {
                    return BadRequest($"File {file.FileName} is not a valid type. Please select a JPEG or PNG image.");
                }
            }

            try
            {
                await _productImageService.SaveSelectedImages(productId, imageUrls, files, isMain);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

    }
}
