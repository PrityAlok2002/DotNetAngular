using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Entities.Epm.LGoods.ProductManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Application.Interfaces
{
    public interface IProductService
    {
        Task<Product> CreateProductAsync(Product product);
        Task DeleteProductAsync(int id);
        Task<IEnumerable<Product>> GetProductsAsync(ProductFilter filter);

        Task<Product> UpdateProductAsync(Product product); // Add this line

        Task<Product> GetProductByIdAsync(int id);

        Task<IEnumerable<Product>> GetLowStockProducts();

    }
}
