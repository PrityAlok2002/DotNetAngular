using Epm.LGoods.ProductManagement.API.Controllers;
using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Core.Entities;
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
    public class ProductImageControllerTests
    {
        private Mock<IProductImageService> _mockProductImageService;
        private ProductImageController _controller;

        [TestInitialize]
        public void TestInitialize()
        {
            _mockProductImageService = new Mock<IProductImageService>();
            _controller = new ProductImageController(_mockProductImageService.Object);
        }

        [TestMethod]
        public async Task GetAllProductImages_ReturnsOkResult_WithProductImages()
        {
            // Arrange
            var productImages = new List<ProductImage>
            {
                new ProductImage { ImageId = 1, ImageUrl = "http://example.com/image1.jpg" },
                new ProductImage { ImageId = 2, ImageUrl = "http://example.com/image2.jpg" }
            };

            _mockProductImageService.Setup(service => service.GetAllProductImagesAsync())
                .ReturnsAsync(productImages);

            // Act
            var result = await _controller.GetAllProductImages();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.AreEqual(productImages, okResult.Value);
        }

        [TestMethod]
        public async Task SaveSelectedImages_ReturnsBadRequest_WhenNoFilesSelected()
        {
            // Arrange
            var productId = 1;
            var imageUrls = new List<string>();
            var files = new List<IFormFile>();
            var isMain = "true";

            // Act
            var result = await _controller.SaveSelectedImages(productId, imageUrls, files, isMain);

            // Assert
            var badRequestResult = result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult);
            Assert.AreEqual(400, badRequestResult.StatusCode);
            Assert.AreEqual("No files selected.", badRequestResult.Value);
        }

        [TestMethod]
        public async Task SaveSelectedImages_ReturnsBadRequest_WhenFileIsTooLarge()
        {
            // Arrange
            var productId = 1;
            var imageUrls = new List<string> { "http://example.com/image1.jpg" };
            var files = new List<IFormFile>
            {
                new FormFile(null, 0, 3 * 1024 * 1024, "file", "largeimage.jpg")
            };
            var isMain = "true";

            // Act
            var result = await _controller.SaveSelectedImages(productId, imageUrls, files, isMain);

            // Assert
            var badRequestResult = result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult);
            Assert.AreEqual(400, badRequestResult.StatusCode);
            Assert.AreEqual("File largeimage.jpg is too large. Please select a file smaller than 2MB.", badRequestResult.Value);
        }

        [TestMethod]
        public async Task SaveSelectedImages_ReturnsBadRequest_WhenFileTypeIsInvalid()
        {
            // Arrange
            var productId = 1;
            var imageUrls = new List<string> { "http://example.com/image1.jpg" };

            // Mock the IFormFile object
            var mockFile = new Mock<IFormFile>();
            mockFile.Setup(f => f.ContentType).Returns("text/plain"); // Invalid content type
            mockFile.Setup(f => f.Length).Returns(1 * 1024 * 1024); // 1MB file size
            mockFile.Setup(f => f.FileName).Returns("invalidfile.txt"); // File name

            var files = new List<IFormFile> { mockFile.Object };
            var isMain = "true";

            // Act
            var result = await _controller.SaveSelectedImages(productId, imageUrls, files, isMain);

            // Assert
            var badRequestResult = result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult);
            Assert.AreEqual(400, badRequestResult.StatusCode);
            Assert.AreEqual("File invalidfile.txt is not a valid type. Please select a JPEG or PNG image.", badRequestResult.Value);
        }



        [TestMethod]
        public async Task SaveSelectedImages_ReturnsOk_WhenValidFilesAreSelected()
        {
            // Arrange
            var productId = 1;
            var imageUrls = new List<string> { "http://example.com/image1.jpg" };
            var mockFile = new Mock<IFormFile>();
            mockFile.Setup(f => f.ContentType).Returns("image/jpeg"); // Valid content type
            mockFile.Setup(f => f.Length).Returns(1 * 1024 * 1024); // 1MB file size
            mockFile.Setup(f => f.FileName).Returns("validimage.jpg"); // File name

            var files = new List<IFormFile> { mockFile.Object };
            var isMain = "true";

            _mockProductImageService.Setup(service => service.SaveSelectedImages(productId, imageUrls, files, isMain))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.SaveSelectedImages(productId, imageUrls, files, isMain);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkResult));
        }

        [TestMethod]
        public async Task SaveSelectedImages_ReturnsServerError_WhenExceptionThrown()
        {
            // Arrange
            var productId = 1;
            var imageUrls = new List<string> { "http://example.com/image1.jpg" };
            var mockFile = new Mock<IFormFile>();
            mockFile.Setup(f => f.ContentType).Returns("image/jpeg"); // Valid content type
            mockFile.Setup(f => f.Length).Returns(1 * 1024 * 1024); // 1MB file size
            mockFile.Setup(f => f.FileName).Returns("validimage.jpg"); // File name

            var files = new List<IFormFile> { mockFile.Object };
            var isMain = "true";

            _mockProductImageService.Setup(service => service.SaveSelectedImages(productId, imageUrls, files, isMain))
                .ThrowsAsync(new System.Exception("An error occurred"));

            // Act
            var result = await _controller.SaveSelectedImages(productId, imageUrls, files, isMain);

            // Assert
            var serverErrorResult = result as ObjectResult;
            Assert.IsNotNull(serverErrorResult);
            Assert.AreEqual(500, serverErrorResult.StatusCode);
            Assert.AreEqual("An error occurred", serverErrorResult.Value);
        }
    }
}