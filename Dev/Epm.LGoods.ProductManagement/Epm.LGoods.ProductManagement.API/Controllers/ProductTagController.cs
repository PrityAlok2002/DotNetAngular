using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Epm.LGoods.ProductManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductTagController : ControllerBase
    {
        private readonly IProductTagService _productTagService;

        public ProductTagController(IProductTagService productTagService)
        {
            _productTagService = productTagService;
        }
        [HttpPost("addTags")]
        public async Task<IActionResult> AddTagsToProduct([FromBody] AddTagsToProductDto dto)
        {
            await _productTagService.AddTagsToProductAsync(dto);
            return Ok();
        }


        [HttpGet("tags")]
        public async Task<ActionResult<IEnumerable<TagDto>>> GetAllTags()
        {
            var tags = await _productTagService.GetAllTagsAsync();
            var tagDtos = tags.Select(tag => new TagDto
            {
                TagId = tag.TagId,
                TagName = tag.TagName,
                TaggedProducts = tag.TaggedProducts,
                Published = tag.Published
            });

            return Ok(tagDtos);
        }

        [HttpGet("product/{productId}/tags")]
        public async Task<ActionResult<IEnumerable<Tag>>> GetTagsForProduct(int productId)
        {
            var tags = await _productTagService.GetTagsForProductAsync(productId);
            return Ok(tags);
        }

       

    }

}
