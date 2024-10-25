using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Infrastructure.Repositories
{
  
        public class ProductTagRepository : IProductTagRepository
        {
            private readonly ApplicationDbContext _context;

            public ProductTagRepository(ApplicationDbContext context)
            {
                _context = context;
            }

        public async Task AddTagsToProductAsync(int productId, IEnumerable<int> tagIds)
        {
            var existingTags = await _context.ProductTags
                .Where(pt => pt.ProductId == productId)
                .Select(pt => pt.TagId)
                .ToListAsync();

            var newTagIds = tagIds.Except(existingTags);

            var newProductTags = newTagIds.Select(tagId => new ProductTag
            {
                ProductId = productId,
                TagId = tagId
            });

            await _context.ProductTags.AddRangeAsync(newProductTags);

            // Update the TaggedProducts count
            foreach (var tagId in newTagIds)
            {
                var tag = await _context.Tags.FindAsync(tagId);
                if (tag != null)
                {
                    tag.TaggedProducts++;
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Tag>> GetTagsForProductAsync(int productId)
        {
            return await _context.ProductTags
                .Where(pt => pt.ProductId == productId)
                .Select(pt => pt.Tag)
                .ToListAsync();
        }

      
    }
}

