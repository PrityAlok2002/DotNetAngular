using Epm.LGoods.ProductManagement.API.Controllers;
using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Entities.Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Test
{
    [TestClass]
    public class CategoryControllerTests
    {
        private Mock<ICategoryService> _mockCategoryService;
        private CategoryController _categoryController;

        [TestInitialize]
        public void Setup()
        {
            _mockCategoryService = new Mock<ICategoryService>();
            _categoryController = new CategoryController(_mockCategoryService.Object);
        }

        [TestMethod]
        public async Task GetAllCategories_ReturnsOkResult_WithListOfCategories()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category { CategoryName = "Category1" },
                new Category { CategoryName = "Category2" }
            };
            _mockCategoryService.Setup(service => service.GetAllCategories()).ReturnsAsync(categories);

            // Act
            var result = await _categoryController.GetAllCategories();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.IsInstanceOfType(okResult.Value, typeof(IEnumerable<Category>));
            Assert.AreEqual(categories, okResult.Value);
        }

        [TestMethod]
        public async Task GetAllCategories_ReturnsInternalServerError_WhenExceptionIsThrown()
        {
            // Arrange
            _mockCategoryService.Setup(service => service.GetAllCategories()).ThrowsAsync(new Exception("Test exception"));

            // Act
            var result = await _categoryController.GetAllCategories();

            // Assert
            var statusCodeResult = result.Result as ObjectResult;
            Assert.IsNotNull(statusCodeResult);
            Assert.AreEqual(500, statusCodeResult.StatusCode);
            Assert.AreEqual("Test exception", statusCodeResult.Value);
        }

        [TestMethod]
        public async Task GetCategoryByName_ReturnsOkResult_WithTrue_WhenCategoryExists()
        {
            // Arrange
            var categoryName = "ExistingCategory";
            _mockCategoryService.Setup(service => service.GetCategoryByName(categoryName)).ReturnsAsync(true);

            // Act
            var result = await _categoryController.GetCategoryByName(categoryName);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.AreEqual(true, okResult.Value);
        }

        [TestMethod]
        public async Task GetCategoryByName_ReturnsInternalServerError_WhenExceptionIsThrown()
        {
            // Arrange
            var categoryName = "Category";
            _mockCategoryService.Setup(service => service.GetCategoryByName(categoryName))
                .ThrowsAsync(new Exception("Test exception"));

            // Act
            var result = await _categoryController.GetCategoryByName(categoryName);

            // Assert
            var statusCodeResult = result.Result as ObjectResult;
            Assert.IsNotNull(statusCodeResult);
            Assert.AreEqual(500, statusCodeResult.StatusCode);
            Assert.AreEqual("Test exception", statusCodeResult.Value);
        }


        [TestMethod]
        public async Task AddCategory_CallsServiceMethod()
        {
            // Arrange
            var categoryDto = new CategoryDto
            {
                CategoryName = "NewCategory",
                Description = "Description",
                Image = CreateMockImageFile("test.png", "image/png", 1 * 1024 * 1024) // 1 MB file
            };

            _mockCategoryService.Setup(service => service.GetCategoryByName(categoryDto.CategoryName))
                .ReturnsAsync(false);

            // Act
            var result = await _categoryController.AddCategory(categoryDto);

            // Assert
            _mockCategoryService.Verify(service => service.AddCategory(categoryDto), Times.Once);
        }

        private IFormFile CreateMockImageFile(string fileName, string mimeType, long length)
        {
            var fileMock = new Mock<IFormFile>();
            var content = "Fake file content";
            var ms = new MemoryStream();
            var writer = new StreamWriter(ms);
            writer.Write(content);
            writer.Flush();
            ms.Position = 0;

            fileMock.Setup(f => f.FileName).Returns(fileName);
            fileMock.Setup(f => f.Length).Returns(length);
            fileMock.Setup(f => f.OpenReadStream()).Returns(ms);
            fileMock.Setup(f => f.ContentType).Returns(mimeType);

            return fileMock.Object;
        }


        [TestMethod]
        public async Task AddCategory_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            _categoryController.ModelState.AddModelError("CategoryName", "Required");

            var categoryDto = new CategoryDto { CategoryName = "", Description = "Description" };

            // Act
            var result = await _categoryController.AddCategory(categoryDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        }
        [TestMethod]
        public async Task GetCategoryById_ReturnsOkResult_WithCategory()
        {
            // Arrange
            int categoryId = 1;
            var category = new Category { CategoryName = "Category1" };
            _mockCategoryService.Setup(service => service.GetCategoryById(categoryId)).ReturnsAsync(category);

            // Act
            var result = await _categoryController.GetCategoryById(categoryId);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.IsInstanceOfType(okResult.Value, typeof(Category));
            Assert.AreEqual(category, okResult.Value);
        }

        [TestMethod]
        public async Task UpdateCategory_ReturnsOkResult_WhenCategoryIsUpdated()
        {
            // Arrange
            int categoryId = 1;
            var categoryDto = new CategoryDto { CategoryName = "UpdatedCategory", Description = "UpdatedDescription" };

            // Act
            var result = await _categoryController.UpdateCategory(categoryId, categoryDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkResult));
        }

        [TestMethod]
        public async Task UpdateCategory_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            int categoryId = 1;
            _categoryController.ModelState.AddModelError("CategoryName", "Required");
            var categoryDto = new CategoryDto { CategoryName = "", Description = "UpdatedDescription" };

            // Act
            var result = await _categoryController.UpdateCategory(categoryId, categoryDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        }



    }
}
