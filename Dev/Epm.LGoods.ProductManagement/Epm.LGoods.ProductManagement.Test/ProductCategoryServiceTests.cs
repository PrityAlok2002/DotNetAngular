using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using Epm.LGoods.ProductManagement.Application.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

[TestClass]
public class ProductCategoryServiceTests
{
    private Mock<IProductCategoryRepository> _mockRepository;
    private ProductCategoryService _service;

    [TestInitialize]
    public void Setup()
    {
        _mockRepository = new Mock<IProductCategoryRepository>();
        _service = new ProductCategoryService(_mockRepository.Object);
    }

    [TestMethod]
    public async Task AddProductToCategoryAsync_CallsRepositoryMethod()
    {
        // Arrange
        var productId = 1;
        var categoryId = 1;

        // Act
        await _service.AddProductToCategoryAsync(productId, categoryId);

        // Assert
        _mockRepository.Verify(r => r.AddProductToCategoryAsync(productId, categoryId), Times.Once);
    }

    //[TestMethod]
    //public async Task RemoveProductFromCategoryAsync_CallsRepositoryMethod()
    //{
    //    // Arrange
    //    var productId = 1;
    //    var categoryId = 1;

    //    // Act
    //    await _service.RemoveProductFromCategoryAsync(productId, categoryId);

    //    // Assert
    //    _mockRepository.Verify(r => r.RemoveProductFromCategoryAsync(productId, categoryId), Times.Once);
    //}

    [TestMethod]
    public async Task GetProductCategoriesAsync_ReturnsCategories()
    {
        // Arrange
        var productCategories = new List<ProductCategory>
        {
            new ProductCategory { ProductCategoryid = 1, ProductId = 1, CategoryId = 1 },
            new ProductCategory { ProductCategoryid = 2, ProductId = 2, CategoryId = 2 }
        };

        _mockRepository.Setup(r => r.GetProductCategoriesAsync()).ReturnsAsync(productCategories);

        // Act
        var result = await _service.GetProductCategoriesAsync();

        // Assert
        Assert.AreEqual(productCategories, result);
    }
}
