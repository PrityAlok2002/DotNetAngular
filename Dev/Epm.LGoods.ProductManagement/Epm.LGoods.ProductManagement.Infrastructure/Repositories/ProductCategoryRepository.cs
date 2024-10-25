using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Infrastructure.Repositories
{
    public class ProductCategoryRepository : IProductCategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductCategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddProductToCategoryAsync(int productId, int categoryId)
        {
            var productCategory = new ProductCategory { ProductId = productId, CategoryId = categoryId };
            _context.ProductCategories.Add(productCategory);
            await _context.SaveChangesAsync();
        }


        public async Task<IEnumerable<ProductCategory>> GetProductCategoriesAsync()
        {
            return await _context.ProductCategories

                .ToListAsync();
        }
    }
}
