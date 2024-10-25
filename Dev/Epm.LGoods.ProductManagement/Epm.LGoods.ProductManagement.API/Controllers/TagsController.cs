using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Epm.LGoods.ProductManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private readonly ITagService _tagService;

        public TagsController(ITagService tagService)
        {
            _tagService = tagService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTag([FromBody] TagDto tagDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _tagService.AddTagAsync(tagDto);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetTags([FromQuery] string? tagName, [FromQuery] bool? published)
        {
            var tags = await _tagService.GetTagsAsync(tagName, published);
            return Ok(tags);
        }

        [HttpGet("{tagId}")]
        public async Task<IActionResult> GetTag(int tagId)
        {
            var tag = await _tagService.GetTagByIdAsync(tagId);
            if (tag == null)
            {
                return NotFound();
            }
            return Ok(tag);
        }

        [HttpPut("{tagId}")]
        public async Task<IActionResult> UpdateTag(int tagId, [FromBody] TagDto tagDto)
        {
            if (tagId != tagDto.TagId)
            {
                return BadRequest("Tag ID mismatch");
            }

            var existingTag = await _tagService.GetTagByIdAsync(tagId);
            if (existingTag == null)
            {
                return NotFound();
            }

            await _tagService.UpdateTagAsync(tagDto);
            return NoContent();
        }

        [HttpDelete("{tagId}")]
        public async Task<IActionResult> DeleteTag(int tagId)
        {
            var tag = await _tagService.GetTagByIdAsync(tagId);
            if (tag == null)
            {
                return NotFound();
            }

            await _tagService.DeleteTagAsync(tagId);
            return NoContent();
        }
    }
}
