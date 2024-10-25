using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;

namespace Epm.LGoods.ProductManagement.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            return await _productRepository.AddProductAsync(product);
        }

        public async Task DeleteProductAsync(int id)
        {
            await _productRepository.DeleteProductAsync(id);
        }

        public async Task<IEnumerable<Product>> GetProductsAsync(ProductFilter filter = null)
        {
            return await _productRepository.GetProductsAsync(filter);
        }


        public async Task<IEnumerable<Product>> GetLowStockProducts()
        {
            return await _productRepository.GetLowStockProducts();
        }

        public async Task<Product> UpdateProductAsync(Product product)
        {
            return await _productRepository.UpdateProductAsync(product);
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _productRepository.GetByIdAsync(id); // Adjust as necessary
        }
    }
}
