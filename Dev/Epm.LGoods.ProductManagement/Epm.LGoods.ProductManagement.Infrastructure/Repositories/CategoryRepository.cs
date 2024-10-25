using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Entities.Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Epm.LGoods.ProductManagement.Infrastructure.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;
        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task AddCategory(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Category>> GetAllCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<bool> GetCategoryByName(string name)
        {
            return await Task.FromResult(_context.Categories.Any(c => c.CategoryName.ToLower() == name.ToLower()));
        }

        public async Task<Category> GetCategoryById(int id)
        {
            return await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == id);
        }

        public async Task UpdateCategory(Category category)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
        }

        public async Task<int> CountAsync()
        {
            return await _context.Categories.CountAsync();
        }
    }
}
