using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Epm.LGoods.ProductManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Epm.LGoods.ProductManagement.Tests
{
    [TestClass]
    public class ProductRepositoryTests
    {
        private ApplicationDbContext _context;
        private ProductRepository _repository;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Unique database for each test
                .Options;

            _context = new ApplicationDbContext(options);
            _repository = new ProductRepository(_context);

            // Seed data
            _context.Products.AddRange(
                new Product { ProductId = 1, ProductName = "Product1", ProductType = "Type1", CountryOfOrigin = "USA", ShortDescription = "Short description 1" },
                new Product { ProductId = 2, ProductName = "Product2", ProductType = "Type2", CountryOfOrigin = "Canada", ShortDescription = "Short description 2" }
            );
            _context.SaveChanges();
        }

        [TestMethod]
        public async Task AddProductAsync_ShouldAddProduct()
        {
            var product = new Product { ProductId = 3, ProductName = "Product3", ProductType = "Type3", CountryOfOrigin = "Mexico", ShortDescription = "Short description 3" };

            var result = await _repository.AddProductAsync(product);

            Assert.AreEqual(product, result);
            Assert.AreEqual(3, _context.Products.Count());
        }

        [TestMethod]
        public async Task DeleteProductAsync_ShouldDeleteProduct()
        {
            await _repository.DeleteProductAsync(1);

            var product = await _context.Products.FindAsync(1);
            Assert.IsNull(product);
            Assert.AreEqual(1, _context.Products.Count());
        }

        [TestMethod]
        public async Task GetProductsAsync_ShouldReturnAllProducts()
        {
            var products = await _repository.GetProductsAsync(null); // Pass null for the filter parameter

            Assert.AreEqual(2, products.Count());
        }

        [TestMethod]
        public async Task GetProductsAsync_WithFilter_ShouldReturnFilteredProducts()
        {
            var filter = new ProductFilter { ProductName = "Product1" };
            var products = await _repository.GetProductsAsync(filter);

            Assert.AreEqual(1, products.Count());
            Assert.AreEqual("Product1", products.First().ProductName);
        }

        [TestMethod]
        public async Task UpdateProductAsync_ShouldUpdateProduct()
        {
            // Arrange
            // Set up a new DbContext for this test to avoid conflicts
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Unique database for each test
                .Options;

            using (var context = new ApplicationDbContext(options))
            {
                var repository = new ProductRepository(context);

                // Seed data in the new context
                context.Products.AddRange(
                    new Product { ProductId = 1, ProductName = "Product1", ProductType = "Type1", CountryOfOrigin = "USA", ShortDescription = "Short description 1" }
                );
                context.SaveChanges();

                // Retrieve the existing product from the new context
                var existingProduct = await context.Products.FindAsync(1);
                if (existingProduct == null)
                {
                    Assert.Fail("Product should be present in the database.");
                }

                // Update the properties
                existingProduct.ProductName = "New Name";
                existingProduct.ShortDescription = "New Description";

                // Act
                await repository.UpdateProductAsync(existingProduct);

                // Assert
                var updatedProduct = await context.Products.FindAsync(1);
                Assert.IsNotNull(updatedProduct, "Product should be present in the database.");
                Assert.AreEqual("New Name", updatedProduct.ProductName, "Product Name should be updated.");
                Assert.AreEqual("New Description", updatedProduct.ShortDescription, "Product Description should be updated.");
            }
        }

        [TestMethod]
        public async Task GetByIdAsync_ShouldReturnProduct()
        {
            var product = await _repository.GetByIdAsync(1);

            Assert.IsNotNull(product);
            Assert.AreEqual("Product1", product.ProductName);
        }

        [TestMethod]
        public async Task GetByIdAsync_ShouldReturnNull_WhenProductDoesNotExist()
        {
            var product = await _repository.GetByIdAsync(99);

            Assert.IsNull(product);
        }

        [TestMethod]
        public async Task GetLowStockProducts_ShouldReturnLowStockProducts()
        {
           

            _context.Products.AddRange(
                new Product { ProductName = "Product1", ProductType = "Type1", ShortDescription = "Desc1", CountryOfOrigin = "Country1", StockQuantity = 10 },
                new Product { ProductName = "Product2", ProductType = "Type2", ShortDescription = "Desc2", CountryOfOrigin = "Country2", StockQuantity = 100 }
            );
            await _context.SaveChangesAsync();

            // Act
            var lowStockProducts = await _repository.GetLowStockProducts();

            // Assert
            Assert.AreEqual(1, lowStockProducts.Count());
            Assert.AreEqual("Product1", lowStockProducts.First().ProductName);
        }


        [TestMethod]
        public async Task CountAsync_ReturnsCorrectCount()
        {
            _context.Products.AddRange(
                new Product { ProductName = "Product3", ProductType = "Type3", ShortDescription = "Desc3", CountryOfOrigin = "Country3", StockQuantity = 50 },
                new Product { ProductName = "Product4", ProductType = "Type4", ShortDescription = "Desc4", CountryOfOrigin = "Country4", StockQuantity = 150 }
            );
            await _context.SaveChangesAsync();

            var count = await _repository.CountAsync();

            Assert.AreEqual(4, count); 
        }
    }
}
