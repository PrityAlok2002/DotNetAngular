using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Epm.LGoods.ProductManagement.API.Controllers;
using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Core.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Tests
{
    [TestClass]
    public class ProductTagControllerTests
    {
        private Mock<IProductTagService> _mockProductTagService;
        private ProductTagController _controller;

        [TestInitialize]
        public void TestInitialize()
        {
            _mockProductTagService = new Mock<IProductTagService>();
            _controller = new ProductTagController(_mockProductTagService.Object);
        }

        [TestMethod]
        public async Task AddTagsToProduct_ShouldReturnOk()
        {
            // Arrange
            var dto = new AddTagsToProductDto
            {
                ProductId = 1,
                TagIds = new List<int> { 1, 2, 3 }
            };

            _mockProductTagService.Setup(s => s.AddTagsToProductAsync(It.IsAny<AddTagsToProductDto>()))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.AddTagsToProduct(dto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkResult));
            _mockProductTagService.Verify(s => s.AddTagsToProductAsync(dto), Times.Once);
        }

        [TestMethod]
        public async Task GetAllTags_ShouldReturnOkWithTagDtos()
        {
            // Arrange
            var tags = new List<Tag>
            {
                new Tag { TagId = 1, TagName = "Tag1", TaggedProducts = 5, Published = true },
                new Tag { TagId = 2, TagName = "Tag2", TaggedProducts = 3, Published = true }
            };

            _mockProductTagService.Setup(s => s.GetAllTagsAsync())
                .ReturnsAsync(tags);

            // Act
            var result = await _controller.GetAllTags();

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);

            var returnedDtos = okResult.Value as IEnumerable<TagDto>;
            Assert.IsNotNull(returnedDtos);
            Assert.AreEqual(2, returnedDtos.Count());

            var firstDto = returnedDtos.First();
            Assert.AreEqual(1, firstDto.TagId);
            Assert.AreEqual("Tag1", firstDto.TagName);
            Assert.AreEqual(5, firstDto.TaggedProducts);
            Assert.IsTrue(firstDto.Published);
        }

        [TestMethod]
        public async Task GetTagsForProduct_ShouldReturnOkWithTags()
        {
            // Arrange
            var productId = 1;
            var tags = new List<Tag>
            {
                new Tag { TagId = 1, TagName = "Tag1", TaggedProducts = 5, Published = true },
                new Tag { TagId = 2, TagName = "Tag2", TaggedProducts = 3, Published = true }
            };

            _mockProductTagService.Setup(s => s.GetTagsForProductAsync(productId))
                .ReturnsAsync(tags);

            // Act
            var result = await _controller.GetTagsForProduct(productId);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);

            var returnedTags = okResult.Value as IEnumerable<Tag>;
            Assert.IsNotNull(returnedTags);
            Assert.AreEqual(2, returnedTags.Count());

            var firstTag = returnedTags.First();
            Assert.AreEqual(1, firstTag.TagId);
            Assert.AreEqual("Tag1", firstTag.TagName);
            Assert.AreEqual(5, firstTag.TaggedProducts);
            Assert.IsTrue(firstTag.Published);
        }
    }
}
