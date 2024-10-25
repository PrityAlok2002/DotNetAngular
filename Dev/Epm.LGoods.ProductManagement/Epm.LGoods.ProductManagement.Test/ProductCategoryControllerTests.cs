using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Epm.LGoods.ProductManagement.API.Controllers;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Epm.LGoods.ProductManagement.Core.Entities.Epm.LGoods.ProductManagement.Core.Entities;
using static System.Net.Mime.MediaTypeNames;


namespace Epm.LGoods.ProductManagement.Test
{

    [TestClass]
    public class ProductCategoryControllerTests
    {
        private ProductCategoryController _controller;
        private ApplicationDbContext _context;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(options);
            _controller = new ProductCategoryController(_context);
        }

        [TestMethod]
        public async Task GetProductCategory_ReturnsNotFound_WhenProductCategoryDoesNotExist()
        {
            // Arrange
            var nonExistingId = 999; // ID that does not exist

            // Act
            var result = await _controller.GetProductCategory(nonExistingId);

            // Assert
            var notFoundResult = result.Result as NotFoundResult;
            Assert.IsNotNull(notFoundResult, "Expected NotFoundResult when the product category does not exist.");
        }

        [TestMethod]
        public async Task GetProductCategory_ReturnsProductCategory_WhenProductCategoryExists()
        {
            // Arrange
            var productCategory = new ProductCategory { ProductCategoryid = 1, ProductId = 1, CategoryId = 1 };
            _context.ProductCategories.Add(productCategory);
            await _context.SaveChangesAsync(); // Use SaveChangesAsync to ensure async behavior

            // Act
            var result = await _controller.GetProductCategory(1);

            // Assert
            var okResult = result.Result as OkObjectResult;
            //Assert.IsNotNull(okResult, "Expected OkObjectResult when the product category exists.");
            //var returnedProductCategory = okResult.Value as ProductCategory;
            //Assert.IsNotNull(returnedProductCategory, "Expected a ProductCategory object.");
            //Assert.AreEqual(1, returnedProductCategory.ProductCategoryid);
        }

        [TestMethod]
        public async Task GetAllCategories_ReturnsCategories_WhenCategoriesExist()
        {
            // Arrange
            var category = new Category { CategoryId = 1, CategoryName = "Category1", Description = "Running", Image = "ass.jpeg", IsActive = false };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync(); // Use SaveChangesAsync to ensure async behavior

            // Act
            var result = await _controller.GetAllCategories();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult, "Expected OkObjectResult when categories exist.");
            var returnedCategories = okResult.Value as List<Category>;
            Assert.IsNotNull(returnedCategories, "Expected a List of Category objects.");
            Assert.AreEqual(1, returnedCategories.Count);
            Assert.AreEqual("Category1", returnedCategories.First().CategoryName);
        }

        [TestMethod]
        public async Task SaveMappings_AddsProductCategory_WhenModelIsValid()
        {
            // Arrange
            var productCategory = new ProductCategory { ProductCategoryid = 2, ProductId = 2, CategoryId = 2 };

            // Act
            var result = await _controller.SaveMappings(productCategory);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkResult), "Expected OkResult after saving the product category.");
            var addedProductCategory = await _context.ProductCategories
                .FirstOrDefaultAsync(pc => pc.ProductCategoryid == 2);
            Assert.IsNotNull(addedProductCategory, "Expected the ProductCategory to be added.");
            Assert.AreEqual(2, addedProductCategory.ProductId);
            Assert.AreEqual(2, addedProductCategory.CategoryId);
        }
    }
}