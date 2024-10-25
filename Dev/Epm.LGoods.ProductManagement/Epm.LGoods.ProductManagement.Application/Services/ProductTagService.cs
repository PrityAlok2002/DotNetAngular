using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Application.Services
{
    public class ProductTagService : IProductTagService
    {
        private readonly IProductTagRepository _productTagRepository;
        private readonly ITagRepository _tagRepository;  // Add this dependency

        public ProductTagService(IProductTagRepository productTagRepository, ITagRepository tagRepository)
        {
            _productTagRepository = productTagRepository;
            _tagRepository = tagRepository;
        }

        public async Task AddTagsToProductAsync(AddTagsToProductDto dto)
        {
            await _productTagRepository.AddTagsToProductAsync(dto.ProductId, dto.TagIds);
        }
        public async Task<IEnumerable<Tag>> GetTagsForProductAsync(int productId)
        {
            return await _productTagRepository.GetTagsForProductAsync(productId);
        }


        public async Task<IEnumerable<Tag>> GetAllTagsAsync()
        {
            var tags= await _tagRepository.GetTagsAsync(null, null);  // Fetch all tags
            return tags.Where(tag => tag.Published);
        }
    }
}
