using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;
using Epm.LGoods.OrderManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Epm.LGoods.OrderManagement.Infrastructure.Repositories
{
    public class ProductImageRepository : IProductImageRepository 
    {
        private readonly ApplicationDbContext _context;

        public ProductImageRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ProductImage> GetImageByIdAsync(int imageId)
        {
            return await _context.ProductImages
                .AsNoTracking()
                .FirstOrDefaultAsync(pi => pi.ImageId == imageId);
        }

        public async Task<IEnumerable<ProductImage>> GetImagesByProductIdAsync(int productId)
        {
            return await _context.ProductImages
                .AsNoTracking()
                .Where(pi => pi.ProductId == productId)
                .ToListAsync();
        }
    }
}
