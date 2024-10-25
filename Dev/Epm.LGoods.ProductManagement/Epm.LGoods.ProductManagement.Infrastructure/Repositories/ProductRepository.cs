using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Epm.LGoods.ProductManagement.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }


        public async Task<Product> AddProductAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Product>> GetProductsAsync(ProductFilter filter = null)
        {
            var productsQuery = _context.Products.AsQueryable();
            var priceQuery = _context.Prices.AsQueryable();
            var categoryQuery = _context.Categories.AsQueryable();

            if (filter != null)
            {
                if (!string.IsNullOrEmpty(filter.ProductName))
                {
                    productsQuery = productsQuery.Where(p => p.ProductName.Contains(filter.ProductName));
                }

                if (!string.IsNullOrEmpty(filter.ProductType))
                {
                    productsQuery = productsQuery.Where(p => p.ProductType == filter.ProductType);
                }

                if (!string.IsNullOrEmpty(filter.CountryOfOrigin))
                {
                    productsQuery = productsQuery.Where(p => p.CountryOfOrigin == filter.CountryOfOrigin);
                }
            }
            return await productsQuery.ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetLowStockProducts()
        {
            return await _context.Products
                .Where(p => p.StockQuantity < 50)
                //.OrderBy(p => p.StockQuantity)
                .ToListAsync();
        }

        public async Task<Product> UpdateProductAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product> GetByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<int> CountAsync()
        {
            return await _context.Products.CountAsync();
        }
    }

}
