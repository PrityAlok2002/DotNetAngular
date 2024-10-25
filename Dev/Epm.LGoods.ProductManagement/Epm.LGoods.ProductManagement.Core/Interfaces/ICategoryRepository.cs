using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Entities.Epm.LGoods.ProductManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Core.Interfaces
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllCategories();
        Task<bool> GetCategoryByName(string name);
        Task AddCategory(Category category);

        Task<Category> GetCategoryById(int id);

        Task UpdateCategory(Category category);

        Task<int> CountAsync();
    }
}
