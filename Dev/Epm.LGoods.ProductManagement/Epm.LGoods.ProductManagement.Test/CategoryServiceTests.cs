using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Services;
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
    public class CategoryServiceTests
    {
        private Mock<ICategoryRepository> _mockCategoryRepository;
        private Mock<BlobContainerClient> _mockBlobContainerClient;
        private Mock<BlobClient> _mockBlobClient;
        private CategoryService _categoryService;
        private const string BlobServiceEndpoint = "https://example.com";
        private const string ContainerName = "categories";
        private const string SasToken = "sas-token";

        [TestInitialize]
        public void Setup()
        {
            _mockCategoryRepository = new Mock<ICategoryRepository>();


            _categoryService = new Application.Services.CategoryService(
                _mockCategoryRepository.Object,
                BlobServiceEndpoint,
                ContainerName,
                SasToken
            );
        }

        [TestMethod]
        public async Task GetAllCategories_ReturnsListOfCategories()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category { CategoryName = "Category1" },
                new Category { CategoryName = "Category2" }
            };
            _mockCategoryRepository.Setup(repo => repo.GetAllCategories()).ReturnsAsync(categories);

            // Act
            var result = await _categoryService.GetAllCategories();

            // Assert
            Assert.AreEqual(categories, result);
        }

        [TestMethod]
        public async Task GetCategoryByName_ReturnsTrue_WhenCategoryExists()
        {
            // Arrange
            var categoryName = "ExistingCategory";
            _mockCategoryRepository.Setup(repo => repo.GetCategoryByName(categoryName)).ReturnsAsync(true);

            // Act
            var result = await _categoryService.GetCategoryByName(categoryName);

            // Assert
            Assert.IsTrue(result);
        }

        [TestMethod]
        public async Task GetCategoryByName_ReturnsFalse_WhenCategoryDoesNotExist()
        {
            // Arrange
            var categoryName = "NonExistingCategory";
            _mockCategoryRepository.Setup(repo => repo.GetCategoryByName(categoryName)).ReturnsAsync(false);

            // Act
            var result = await _categoryService.GetCategoryByName(categoryName);

            // Assert
            Assert.IsFalse(result);
        }

        [TestMethod]
        public async Task AddCategory_SetsImageUrlToNull_WhenImageIsNull()
        {
            // Arrange
            var categoryDto = new CategoryDto
            {
                CategoryName = "NewCategory",
                Description = "NewCategoryDescription",
                Image = null,
                Status = true
            };
            _mockCategoryRepository.Setup(repo => repo.AddCategory(It.IsAny<Category>())).Returns(Task.CompletedTask);

            // Act
            await _categoryService.AddCategory(categoryDto);

            // Assert
            _mockCategoryRepository.Verify(repo => repo.AddCategory(It.Is<Category>(category => category.Image == null)), Times.Once);
        }

        [TestMethod]
        public async Task GetCategoryById_ShouldReturnCategory()
        {
            // Arrange
            int id = 1;
            var category = new Category { CategoryId = id, CategoryName = "Category1" };
            _mockCategoryRepository.Setup(repo => repo.GetCategoryById(id)).ReturnsAsync(category);

            // Act
            var result = await _categoryService.GetCategoryById(id);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Category1", result.CategoryName);
        }

        [TestMethod]
        public async Task UpdateCategory_ShouldUpdateExistingCategory()
        {
            // Arrange
            int id = 1;
            var existingCategory = new Category { CategoryId = id, CategoryName = "OldName", Image = "old-image.jpg" };
            var categoryDto = new CategoryDto
            {
                CategoryName = "UpdatedName",
                Description = "Updated Description",
                Status = false,
                Image = CreateMockFormFile("new-image.jpg", "image/jpeg")
            };
            _mockCategoryRepository.Setup(repo => repo.GetCategoryById(id)).ReturnsAsync(existingCategory);
            _mockCategoryRepository.Setup(repo => repo.UpdateCategory(It.IsAny<Category>())).Returns(Task.CompletedTask);

            // Act
            await _categoryService.UpdateCategory(id, categoryDto);

            // Assert
            Assert.AreEqual("UpdatedName", existingCategory.CategoryName);
            _mockCategoryRepository.Verify(repo => repo.UpdateCategory(It.IsAny<Category>()), Times.Once);
        }

        private IFormFile CreateMockFormFile(string fileName, string contentType)
        {
            var stream = new MemoryStream();
            var formFile = new FormFile(stream, 0, stream.Length, "id", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = contentType
            };
            return formFile;
        }
    }
}