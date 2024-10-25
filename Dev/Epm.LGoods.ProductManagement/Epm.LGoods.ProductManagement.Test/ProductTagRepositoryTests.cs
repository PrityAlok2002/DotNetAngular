using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.EntityFrameworkCore;
using Epm.LGoods.ProductManagement.Infrastructure.Repositories;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Epm.LGoods.ProductManagement.Core.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Tests
{
    [TestClass]
    public class ProductTagRepositoryTests
    {
        private ApplicationDbContext _context;
        private ProductTagRepository _repository;

        [TestInitialize]
        public void TestInitialize()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(options);
            _repository = new ProductTagRepository(_context);

            // Clear the database before each test
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();
        }

        [TestMethod]
        public async Task AddTagsToProductAsync_ShouldAddNewTagsOnly()
        {
            // Arrange
            var productId = 1;
            var existingTagId = 1;
            var newTagId = 2;

            _context.Products.Add(new Product
            {
                ProductId = productId,
                ProductName = "Test Product",
                ProductType = "Test Type",
                ShortDescription = "Test Description",
                CountryOfOrigin = "Test Country"
            });
            _context.Tags.AddRange(
                new Tag { TagId = existingTagId, TagName = "Existing Tag", TaggedProducts = 1 },
                new Tag { TagId = newTagId, TagName = "New Tag", TaggedProducts = 0 }
            );
            _context.ProductTags.Add(new ProductTag { ProductId = productId, TagId = existingTagId });
            await _context.SaveChangesAsync();

            // Act
            await _repository.AddTagsToProductAsync(productId, new[] { existingTagId, newTagId });

            // Assert
            var productTags = await _context.ProductTags.Where(pt => pt.ProductId == productId).ToListAsync();
            Assert.AreEqual(2, productTags.Count);
            Assert.IsTrue(productTags.Any(pt => pt.TagId == existingTagId));
            Assert.IsTrue(productTags.Any(pt => pt.TagId == newTagId));

            var existingTag = await _context.Tags.FindAsync(existingTagId);
            var newTag = await _context.Tags.FindAsync(newTagId);
            Assert.AreEqual(1, existingTag.TaggedProducts);
            Assert.AreEqual(1, newTag.TaggedProducts);
        }

        [TestMethod]
        public async Task AddTagsToProductAsync_ShouldNotAddDuplicateTags()
        {
            // Arrange
            var productId = 1;
            var tagId = 1;

            _context.Products.Add(new Product
            {
                ProductId = productId,
                ProductName = "Test Product",
                ProductType = "Test Type",
                ShortDescription = "Test Description",
                CountryOfOrigin = "Test Country"
            });
            _context.Tags.Add(new Tag { TagId = tagId, TagName = "Test Tag", TaggedProducts = 1 });
            _context.ProductTags.Add(new ProductTag { ProductId = productId, TagId = tagId });
            await _context.SaveChangesAsync();

            // Act
            await _repository.AddTagsToProductAsync(productId, new[] { tagId });

            // Assert
            var productTags = await _context.ProductTags.Where(pt => pt.ProductId == productId).ToListAsync();
            Assert.AreEqual(1, productTags.Count);

            var tag = await _context.Tags.FindAsync(tagId);
            Assert.AreEqual(1, tag.TaggedProducts);
        }
        [TestMethod]
        public async Task GetTagsForProductAsync_ShouldReturnTagsForGivenProduct()
        {
            // Arrange
            var productId = 1;

            var tags = new List<Tag>
            {
                new Tag { TagId = 1, TagName = "Tag1", TaggedProducts = 5, Published = true },
                new Tag { TagId = 2, TagName = "Tag2", TaggedProducts = 3, Published = true }
            };

            var productTags = tags.Select(t => new ProductTag { ProductId = productId, TagId = t.TagId }).ToList();

            _context.Products.Add(new Product
            {
                ProductId = productId,
                ProductName = "Test Product",
                ProductType = "Test Type",
                ShortDescription = "Test Description",
                CountryOfOrigin = "Test Country"
            });

            _context.Tags.AddRange(tags);
            _context.ProductTags.AddRange(productTags);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetTagsForProductAsync(productId);

            // Assert
            Assert.AreEqual(2, result.Count());
            CollectionAssert.AreEqual(new[] { "Tag1", "Tag2" }, result.Select(t => t.TagName).ToArray());
            CollectionAssert.AreEqual(new[] { 5, 3 }, result.Select(t => t.TaggedProducts).ToArray());
        }


        [TestCleanup]
        public void TestCleanup()
        {
            _context.Dispose();
        }
    }
}