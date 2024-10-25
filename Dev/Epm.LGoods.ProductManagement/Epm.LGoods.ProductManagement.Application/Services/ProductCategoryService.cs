using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;


namespace Epm.LGoods.ProductManagement.Application.Services
{
    public class ProductCategoryService : IProductCategoryService
    {
        private readonly IProductCategoryRepository _repository;

        public ProductCategoryService(IProductCategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task AddProductToCategoryAsync(int productId, int categoryId)
        {
            await _repository.AddProductToCategoryAsync(productId, categoryId);
        }

        //public async Task RemoveProductFromCategoryAsync(int productId, int categoryId)
        //{
        //    await _repository.RemoveProductFromCategoryAsync(productId, categoryId);
        //}

        public async Task<IEnumerable<ProductCategory>> GetProductCategoriesAsync()
        {
            return await _repository.GetProductCategoriesAsync();
        }
    }
}
