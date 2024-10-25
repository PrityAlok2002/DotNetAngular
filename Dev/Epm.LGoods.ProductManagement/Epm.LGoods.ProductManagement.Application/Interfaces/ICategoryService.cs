using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Entities.Epm.LGoods.ProductManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllCategories();
        Task<bool> GetCategoryByName(string name);
        Task AddCategory(CategoryDto categoryDto);

        Task<Category> GetCategoryById(int id);

        Task UpdateCategory(int id, CategoryDto categoryDto);
    }
}
