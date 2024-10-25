using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Epm.LGoods.ProductManagement.Application.Services;
using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Tests
{
    [TestClass]
    public class ProductTagServiceTests
    {
        private Mock<IProductTagRepository> _mockProductTagRepository;
        private Mock<ITagRepository> _mockTagRepository;
        private ProductTagService _productTagService;

        [TestInitialize]
        public void TestInitialize()
        {
            _mockProductTagRepository = new Mock<IProductTagRepository>();
            _mockTagRepository = new Mock<ITagRepository>();
            _productTagService = new ProductTagService(_mockProductTagRepository.Object, _mockTagRepository.Object);
        }

        [TestMethod]
        public async Task AddTagsToProductAsync_ShouldCallRepositoryMethod()
        {
            // Arrange
            var dto = new AddTagsToProductDto
            {
                ProductId = 1,
                TagIds = new List<int> { 1, 2, 3 }
            };

            // Act
            await _productTagService.AddTagsToProductAsync(dto);

            // Assert
            _mockProductTagRepository.Verify(r => r.AddTagsToProductAsync(dto.ProductId, dto.TagIds), Times.Once);
        }

        [TestMethod]
        public async Task GetAllTagsAsync_ShouldReturnOnlyPublishedTags()
        {
            // Arrange
            var allTags = new List<Tag>
            {
                new Tag { TagId = 1, TagName = "Tag1", TaggedProducts = 5, Published = true },
                new Tag { TagId = 2, TagName = "Tag2", TaggedProducts = 0, Published = false },
                new Tag { TagId = 3, TagName = "Tag3", TaggedProducts = 3, Published = true }
            };

            _mockTagRepository.Setup(r => r.GetTagsAsync(null, null)).ReturnsAsync(allTags);

            // Act
            var result = await _productTagService.GetAllTagsAsync();

            // Assert
            Assert.AreEqual(2, result.Count());
            Assert.IsTrue(result.All(t => t.Published));
            CollectionAssert.AreEqual(new[] { "Tag1", "Tag3" }, result.Select(t => t.TagName).ToArray());
            CollectionAssert.AreEqual(new[] { 5, 3 }, result.Select(t => t.TaggedProducts).ToArray());
        }

        [TestMethod]
        public async Task GetTagsForProductAsync_ShouldReturnTagsForGivenProduct()
        {
            // Arrange
            var productId = 1;
            var productTags = new List<Tag>
            {
                new Tag { TagId = 1, TagName = "Tag1", TaggedProducts = 5, Published = true },
                new Tag { TagId = 2, TagName = "Tag2", TaggedProducts = 3, Published = true }
            };

            _mockProductTagRepository.Setup(r => r.GetTagsForProductAsync(productId)).ReturnsAsync(productTags);

            // Act
            var result = await _productTagService.GetTagsForProductAsync(productId);

            // Assert
            Assert.AreEqual(2, result.Count());
            CollectionAssert.AreEqual(new[] { "Tag1", "Tag2" }, result.Select(t => t.TagName).ToArray());
            CollectionAssert.AreEqual(new[] { 5, 3 }, result.Select(t => t.TaggedProducts).ToArray());
        }
    }
}