using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Entities.Epm.LGoods.ProductManagement.Core.Entities;

namespace Epm.LGoods.ProductManagement.Core.Interfaces
{
    public interface IProductRepository
    {

        Task<Product> GetByIdAsync(int id);
        Task<Product> AddProductAsync(Product product);

        Task DeleteProductAsync(int id);
        Task<IEnumerable<Product>> GetProductsAsync(ProductFilter filter);

        Task<Product> UpdateProductAsync(Product product);  // Add this line


        Task<IEnumerable<Product>> GetLowStockProducts();

        Task<int> CountAsync();
    }
}
