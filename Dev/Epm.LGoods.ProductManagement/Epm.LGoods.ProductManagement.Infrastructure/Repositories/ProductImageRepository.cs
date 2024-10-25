using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;


namespace Epm.LGoods.ProductManagement.Infrastructure.Repositories
{
    public class ProductImageRepository : IProductImageRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductImageRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<ProductImage>> GetAllProductImagesAsync()
        {
            return await _context.ProductImages.ToListAsync();
        }

        public async Task SaveProductImages(List<ProductImage> productImages)
        {
            _context.ProductImages.AddRange(productImages);
            await _context.SaveChangesAsync();
        }

        public async Task<int> CountAsync()
        {
            return await _context.ProductImages.CountAsync();
        }
    }
}
