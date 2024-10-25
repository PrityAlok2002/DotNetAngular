using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Application.Services;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Tests
{
    [TestClass]
    public class ProductServiceTests
    {
        private Mock<IProductRepository> _productRepositoryMock;
        private IProductService _productService;

        [TestInitialize]
        public void SetUp()
        {
            _productRepositoryMock = new Mock<IProductRepository>();
            _productService = new ProductService(_productRepositoryMock.Object);
        }

        [TestMethod]
        public async Task CreateProductAsync_ReturnsCreatedProduct()
        {
            var product = new Product { ProductId = 1, ProductName = "New Product" };
            _productRepositoryMock.Setup(repo => repo.AddProductAsync(product)).ReturnsAsync(product);

            var result = await _productService.CreateProductAsync(product);

            Assert.AreEqual(product, result);
        }

        [TestMethod]
        public async Task DeleteProductAsync_CallsRepositoryDeleteMethod()
        {
            _productRepositoryMock.Setup(repo => repo.DeleteProductAsync(1)).Returns(Task.CompletedTask);

            await _productService.DeleteProductAsync(1);

            _productRepositoryMock.Verify(repo => repo.DeleteProductAsync(1), Times.Once);
        }

        [TestMethod]
        public async Task GetProductsAsync_ReturnsProducts()
        {
            var filter = new ProductFilter { ProductName = "Test" };
            var products = new List<Product> { new Product { ProductId = 1 } };
            _productRepositoryMock.Setup(repo => repo.GetProductsAsync(filter)).ReturnsAsync(products);

            var result = await _productService.GetProductsAsync(filter);

            Assert.AreEqual(products, result);
        }

        [TestMethod]
        public async Task GetLowStockProducts_ReturnsLowStockProducts()
        {
            var lowStockProducts = new List<Product>
        {
          new Product { ProductId = 1, ProductName = "Low Stock Product", StockQuantity = 10 }
        };
            _productRepositoryMock.Setup(repo => repo.GetLowStockProducts()).ReturnsAsync(lowStockProducts);

            var result = await _productService.GetLowStockProducts();

            Assert.AreEqual(lowStockProducts, result);
        }

        public async Task UpdateProductAsync_ReturnsUpdatedProduct()
        {
            // Arrange
            var product = new Product { ProductId = 1, ProductName = "Updated Product" };
            _productRepositoryMock.Setup(repo => repo.UpdateProductAsync(product)).ReturnsAsync(product);

            // Act
            var result = await _productService.UpdateProductAsync(product);

            // Assert
            Assert.AreEqual(product, result);
        }

        [TestMethod]
        public async Task GetProductByIdAsync_ReturnsProduct_WhenProductExists()
        {
            // Arrange
            var productId = 1;
            var product = new Product { ProductId = productId, ProductName = "Product" };
            _productRepositoryMock.Setup(repo => repo.GetByIdAsync(productId)).ReturnsAsync(product);

            // Act
            var result = await _productService.GetProductByIdAsync(productId);

            // Assert
            Assert.AreEqual(product, result);
        }

        [TestMethod]
        public async Task GetProductByIdAsync_ReturnsNull_WhenProductDoesNotExist()
        {
            // Arrange
            var productId = 1;
            _productRepositoryMock.Setup(repo => repo.GetByIdAsync(productId)).ReturnsAsync((Product)null);

            // Act
            var result = await _productService.GetProductByIdAsync(productId);

            // Assert
            Assert.IsNull(result);
        }
    }
}
