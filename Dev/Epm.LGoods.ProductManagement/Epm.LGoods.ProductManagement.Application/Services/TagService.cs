using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Application.Services
{
    public class TagService : ITagService
    {
        private readonly ITagRepository _tagRepository;

        public TagService(ITagRepository tagRepository)
        {
            _tagRepository = tagRepository;
        }
        public async Task AddTagAsync(TagDto tagDto)
        {
            var tag = new Tag
            {
                TagName = tagDto.TagName,
                TaggedProducts = tagDto.TaggedProducts,
                Published = tagDto.Published
            };
            await _tagRepository.AddTagAsync(tag);
        }

        public async Task<IEnumerable<TagDto>> GetTagsAsync(string tagName, bool? published)
        {
            var tags = await _tagRepository.GetTagsAsync(tagName, published);
            return tags.Select(t => new TagDto
            {
                TagId = t.TagId,
                TagName = t.TagName,
                TaggedProducts = t.TaggedProducts,
                Published = t.Published
            });
        }

        public async Task<TagDto> GetTagByIdAsync(int tagId)
        {
            var tag = await _tagRepository.GetTagByIdAsync(tagId);

            // Check if the tag is null before attempting to create the TagDto
            if (tag == null)
            {
                return null;
            }
            return new TagDto
            {
                TagId = tag.TagId,
                TagName = tag.TagName,
                TaggedProducts = tag.TaggedProducts,
                Published = tag.Published
            };
        }

        public async Task UpdateTagAsync(TagDto tagDto)
        {
            var existingTag = await _tagRepository.GetTagByIdAsync(tagDto.TagId);
            if (existingTag != null)
            {
                // Update the existing tag's properties
                existingTag.TagName = tagDto.TagName;
                existingTag.TaggedProducts = tagDto.TaggedProducts;
                existingTag.Published = tagDto.Published;

                await _tagRepository.UpdateTagAsync(existingTag);
            }
        }

        public async Task DeleteTagAsync(int tagId)
        {
            await _tagRepository.DeleteTagAsync(tagId);
        }
    }
}
