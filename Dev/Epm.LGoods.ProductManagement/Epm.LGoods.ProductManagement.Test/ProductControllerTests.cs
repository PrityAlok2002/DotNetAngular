using Epm.LGoods.ProductManagement.API.Controllers;
using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Tests
{
    [TestClass]
    public class ProductControllerTests
    {
        private Mock<IProductService> _productServiceMock;
        private ProductsController _controller;

        [TestInitialize]
        public void SetUp()
        {
            _productServiceMock = new Mock<IProductService>();
            _controller = new ProductsController(_productServiceMock.Object);
        }

        [TestMethod]
        public async Task Post_ValidProduct_ReturnsCreatedAtActionResult()
        {
            var product = new Product { ProductId = 1, ProductName = "New Product" };
            _productServiceMock.Setup(service => service.CreateProductAsync(product)).ReturnsAsync(product);

            var result = await _controller.Post(product) as CreatedAtActionResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(201, result.StatusCode);
            Assert.AreEqual(product, result.Value);
        }

        [TestMethod]
        public async Task Post_InvalidModelState_ReturnsBadRequest()
        {
            _controller.ModelState.AddModelError("key", "error");

            var result = await _controller.Post(new Product()) as BadRequestObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
        }

        [TestMethod]
        public async Task GetProducts_ReturnsOkResultWithProducts()
        {
            var products = new List<Product> { new Product { ProductId = 1 } };
            _productServiceMock.Setup(s => s.GetProductsAsync(null)).ReturnsAsync(products);

            var result = await _controller.GetProducts(null) as OkObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.AreEqual(products, result.Value);
        }

        [TestMethod]
        public async Task DeleteProduct_ReturnsNoContent()
        {
            _productServiceMock.Setup(s => s.DeleteProductAsync(1)).Returns(Task.CompletedTask);

            var result = await _controller.DeleteProduct(1) as NoContentResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(204, result.StatusCode);
        }


        [TestMethod]
        public async Task GetLowStockProducts_ReturnsOkResultWithLowStockProducts()
        {
            var lowStockProducts = new List<Product>
            {
                new Product { ProductId = 1, ProductName = "Low Stock Product", StockQuantity = 10 }
            };
            _productServiceMock.Setup(s => s.GetLowStockProducts()).ReturnsAsync(lowStockProducts);

            var result = await _controller.GetLowStockProducts();

            var okResult = result.Result as OkObjectResult;

            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.AreEqual(lowStockProducts, okResult.Value);
        }
       
            public async Task UpdateProduct_ReturnsNoContent_WhenProductIsUpdated()
        {
            // Arrange
            var productId = 1;
            var product = new Product { ProductId = productId, ProductName = "Updated Product" };
            _productServiceMock.Setup(service => service.UpdateProductAsync(product))
                .ReturnsAsync(product);

            // Act
            var result = await _controller.UpdateProduct(productId, product);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        [TestMethod]
        public async Task UpdateProduct_ReturnsNotFound_WhenProductIsNotUpdated()
        {
            // Arrange
            var productId = 1;
            var product = new Product { ProductId = productId, ProductName = "Updated Product" };
            _productServiceMock.Setup(service => service.UpdateProductAsync(product))
                .ReturnsAsync((Product)null);

            // Act
            var result = await _controller.UpdateProduct(productId, product);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }

        [TestMethod]
        public async Task GetProductById_ReturnsOk_WhenProductIsFound()
        {
            // Arrange
            var productId = 1;
            var product = new Product { ProductId = productId, ProductName = "Product" };
            _productServiceMock.Setup(service => service.GetProductByIdAsync(productId))
                .ReturnsAsync(product);

            // Act
            var result = await _controller.GetProductById(productId) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(product, result.Value);
        }

        [TestMethod]
        public async Task GetProductById_ReturnsNotFound_WhenProductIsNotFound()
        {
            // Arrange
            var productId = 1;
            _productServiceMock.Setup(service => service.GetProductByIdAsync(productId))
                .ReturnsAsync((Product)null);

            // Act
            var result = await _controller.GetProductById(productId);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }
    }
}
