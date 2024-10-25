using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Application.Services;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Entities.Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Test
{

    [TestClass]
    public class ProductImageServiceTests
    {
        private Mock<IProductImageRepository> _productImageRepositoryMock;
        private string _blobServiceEndpoint;
        private string _containerName;
        private string _sasToken;
        private ProductImageService _productImageService;

        [TestInitialize]
        public void Initialize()
        {
            _productImageRepositoryMock = new Mock<IProductImageRepository>();
            _blobServiceEndpoint = "https://example.blob.core.windows.net";
            _containerName = "images";
            _sasToken = "?sv=2020-08-04&ss=b&srt=sco&sp=rwdlacx&se=2023-07-27T06:00:00Z&st=2022-07-27T18:00:00Z&spr=https&sig=example";
            _productImageService = new ProductImageService(_productImageRepositoryMock.Object, _blobServiceEndpoint, _containerName, _sasToken);
        }

        [TestMethod]
        public async Task GetAllProductImagesAsync_ReturnsProductImages()
        {
            // Arrange
            var productImages = new List<ProductImage>
            {
                new ProductImage { ImageId = 1, ImageUrl = "image1.jpg", ProductId = 1, IsMain = true },
                new ProductImage { ImageId = 2, ImageUrl = "image2.jpg", ProductId = 1, IsMain = false }
            };
            _productImageRepositoryMock.Setup(r => r.GetAllProductImagesAsync()).ReturnsAsync(productImages);

            // Act
            var result = await _productImageService.GetAllProductImagesAsync();

            // Assert
            Assert.AreEqual(2, result.Count());
            Assert.AreEqual("image1.jpg", result.First().ImageUrl);
        }

        [TestMethod]
        public async Task SaveSelectedImages_ValidData_SavesProductImages()
        {
            // Arrange
            var imageUrls = new List<string> { "image1.jpg", "image2.jpg" };
            var files = new List<IFormFile>
            {
                new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("image1")), 0, 6, "image1", "image1.jpg"),
                new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("image2")), 0, 6, "image2", "image2.jpg")
            };
            var productImages = new List<ProductImage>
            {
                new ProductImage { ImageUrl = "image1.jpg", ProductId = 1, IsMain = true },
                new ProductImage { ImageUrl = "image2.jpg", ProductId = 1, IsMain = false }
            };

            // Mock the UploadFileToBlobAsync method
            var productImageServiceMock = new Mock<ProductImageService>(_productImageRepositoryMock.Object, _blobServiceEndpoint, _containerName, _sasToken);
            productImageServiceMock.Setup(s => s.UploadFileToBlobAsync(It.IsAny<IFormFile>())).ReturnsAsync("https://example.blob.core.windows.net/images/image1.jpg");

            // Act
            await productImageServiceMock.Object.SaveSelectedImages(1, imageUrls, files, "imageUrl");

            // Assert
            _productImageRepositoryMock.Verify(r => r.SaveProductImages(It.IsAny<List<ProductImage>>()), Times.Once);
        }

        [TestMethod]
        public async Task SaveSelectedImages_ValidData_WhenIsMainIsImage_SavesProductImages()
        {
            // Arrange
            var imageUrls = new List<string> { "image1.jpg", "image2.jpg" };
            var files = new List<IFormFile>
            {
                new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("image1")), 0, 6, "image1", "image1.jpg"),
                new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("image2")), 0, 6, "image2", "image2.jpg")
            };
            var productImages = new List<ProductImage>
            {
                new ProductImage { ImageUrl = "image1.jpg", ProductId = 1, IsMain = true },
                new ProductImage { ImageUrl = "image2.jpg", ProductId = 1, IsMain = false }
            };

            // Mock the UploadFileToBlobAsync method
            var productImageServiceMock = new Mock<ProductImageService>(_productImageRepositoryMock.Object, _blobServiceEndpoint, _containerName, _sasToken);
            productImageServiceMock.Setup(s => s.UploadFileToBlobAsync(It.IsAny<IFormFile>())).ReturnsAsync("https://example.blob.core.windows.net/images/image1.jpg");

            // Act
            await productImageServiceMock.Object.SaveSelectedImages(1, imageUrls, files, "image");

            // Assert
            _productImageRepositoryMock.Verify(r => r.SaveProductImages(It.IsAny<List<ProductImage>>()), Times.Once);
        }


    }
}
