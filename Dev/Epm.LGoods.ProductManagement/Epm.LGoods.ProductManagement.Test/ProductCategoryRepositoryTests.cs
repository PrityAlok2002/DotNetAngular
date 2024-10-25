

using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Epm.LGoods.ProductManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

[TestClass]
public class ProductCategoryRepositoryTests
{
    private ApplicationDbContext _context;
    private ProductCategoryRepository _repository;

    [TestInitialize]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase" + System.Guid.NewGuid()) // Ensures unique database name
            .Options;

        _context = new ApplicationDbContext(options);
        _repository = new ProductCategoryRepository(_context);
    }

    // Helper method for assertions
    private void AssertProductCategoriesEqual(List<ProductCategory> expected, IEnumerable<ProductCategory> actual)
    {
        Assert.AreEqual(expected.Count, actual.Count(), "The count of product categories should match.");

        var actualList = actual.ToList();
        for (int i = 0; i < expected.Count; i++)
        {
            Assert.AreEqual(expected[i].ProductCategoryid, actualList[i].ProductCategoryid, "The ProductCategoryid should match.");
            Assert.AreEqual(expected[i].ProductId, actualList[i].ProductId, "The ProductId should match.");
            Assert.AreEqual(expected[i].CategoryId, actualList[i].CategoryId, "The CategoryId should match.");
        }
    }

    [TestMethod]
    public async Task AddProductToCategoryAsync_AddsProductCategory()
    {
        // Arrange
        var productId = 1;
        var categoryId = 1;

        // Act
        await _repository.AddProductToCategoryAsync(productId, categoryId);

        // Assert
        var result = await _context.ProductCategories
            .SingleOrDefaultAsync(pc => pc.ProductId == productId && pc.CategoryId == categoryId);
        Assert.IsNotNull(result, "ProductCategory should be added.");
        Assert.AreEqual(productId, result.ProductId, "The ProductId should match.");
        Assert.AreEqual(categoryId, result.CategoryId, "The CategoryId should match.");
    }

    //[TestMethod]
    //public async Task RemoveProductFromCategoryAsync_RemovesExistingProductCategory()
    //{
    //    // Arrange
    //    var productCategory = new ProductCategory { ProductCategoryid = 1, ProductId = 1, CategoryId = 1 };
    //    _context.ProductCategories.Add(productCategory);
    //    await _context.SaveChangesAsync();

    //    // Act
    //    await _repository.RemoveProductFromCategoryAsync(productCategory.ProductId, productCategory.CategoryId);

    //    // Assert
    //    var result = await _context.ProductCategories
    //        .SingleOrDefaultAsync(pc => pc.ProductId == productCategory.ProductId && pc.CategoryId == productCategory.CategoryId);
    //    Assert.IsNull(result, "ProductCategory should be removed.");
    //}

    //[TestMethod]
    //public async Task RemoveProductFromCategoryAsync_DoesNothingIfNotExists()
    //{
    //    // Arrange
    //    var productId = 1;
    //    var categoryId = 1;

    //    // Act
    //    await _repository.RemoveProductFromCategoryAsync(productId, categoryId);

    //    // Assert
    //    var result = await _context.ProductCategories
    //        .SingleOrDefaultAsync(pc => pc.ProductId == productId && pc.CategoryId == categoryId);
    //    Assert.IsNull(result, "ProductCategory should not exist.");
    //}

    [TestMethod]
    public async Task GetProductCategoriesAsync_ReturnsProductCategories()
    {
        // Arrange
        var productCategories = new List<ProductCategory>
        {
            new ProductCategory { ProductCategoryid = 1, ProductId = 1, CategoryId = 1 },
            new ProductCategory { ProductCategoryid = 2, ProductId = 2, CategoryId = 2 }
        };

        _context.ProductCategories.AddRange(productCategories);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetProductCategoriesAsync();

        // Assert
        AssertProductCategoriesEqual(productCategories, result);
    }

    [TestMethod]
    public async Task GetProductCategoriesAsync_ReturnsEmptyWhenNoCategories()
    {
        // Act
        var result = await _repository.GetProductCategoriesAsync();

        // Assert
        Assert.AreEqual(0, result.Count(), "The result should be empty when no categories are present.");
    }
}
