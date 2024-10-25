
using Epm.LGoods.ProductManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Application.Services
{
    public interface IProductCategoryService
    {
        Task AddProductToCategoryAsync(int productId, int categoryId);
        //Task RemoveProductFromCategoryAsync(int productId, int categoryId);
        Task<IEnumerable<ProductCategory>> GetProductCategoriesAsync();
    }

}
