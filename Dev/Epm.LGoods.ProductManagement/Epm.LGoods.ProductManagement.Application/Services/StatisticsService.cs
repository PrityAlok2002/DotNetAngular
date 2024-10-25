using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using IProductImageRepository = Epm.LGoods.ProductManagement.Core.Interfaces.IProductImageRepository;
using IProductRepository = Epm.LGoods.ProductManagement.Core.Interfaces.IProductRepository;


namespace Epm.LGoods.ProductManagement.Application.Services
{
    public class StatisticsService : IStatisticsService
    {
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ITagRepository _tagRepository;
        private readonly IProductImageRepository _imageRepository;

        public StatisticsService(
            IProductRepository productRepository,
            ICategoryRepository categoryRepository,
            ITagRepository tagRepository,
            IProductImageRepository imageRepository)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
            _tagRepository = tagRepository;
            _imageRepository = imageRepository;
        }

        public async Task<StatisticsDto> GetStatisticsAsync()
        {
            return new StatisticsDto
            {
                TotalProducts = await _productRepository.CountAsync(),
                TotalCategories = await _categoryRepository.CountAsync(),
                TotalTags = await _tagRepository.CountAsync(),
                TotalImages = await _imageRepository.CountAsync(),
            };
        }
    }
}
