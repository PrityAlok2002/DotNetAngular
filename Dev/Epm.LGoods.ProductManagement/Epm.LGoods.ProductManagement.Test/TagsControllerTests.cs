using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Threading.Tasks;
using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.API.Controllers;
using Epm.LGoods.ProductManagement.Core.Entities;
using System.Collections.Generic;

namespace Epm.LGoods.ProductManagement.Test
{
    [TestClass]
    public class TagsControllerTests
    {
        private Mock<ITagService> _tagServiceMock;
        private TagsController _controller;

        [TestInitialize]
        public void Setup()
        {
            _tagServiceMock = new Mock<ITagService>();
            _controller = new TagsController(_tagServiceMock.Object);
        }

        #region CreateTag Test

        [TestMethod]
        public async Task CreateTag_ValidTag_ReturnsOk()
        {
            // Arrange
            var tagDto = new TagDto
            {
                TagId = 1,
                TagName = "NewTag",
                Published = true
            };

            // Act
            var result = await _controller.CreateTag(tagDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkResult), "Expected OkResult.");
            _tagServiceMock.Verify(service => service.AddTagAsync(tagDto), Times.Once);
        }

        [TestMethod]
        public async Task CreateTag_InvalidModel_ReturnsBadRequest()
        {
            // Arrange
            _controller.ModelState.AddModelError("Error", "Model is invalid");
            var tagDto = new TagDto(); // Invalid DTO

            // Act
            var result = await _controller.CreateTag(tagDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult), "Expected BadRequestObjectResult.");
        }

        #endregion

        #region GetTags Test

        [TestMethod]
        public async Task GetTags_ReturnsTags()
        {
            // Arrange
            var tags = new List<TagDto>
            {
                new TagDto { TagId = 1, TagName = "Tag1", Published = true },
                new TagDto { TagId = 2, TagName = "Tag2", Published = false }
            };

            _tagServiceMock.Setup(service => service.GetTagsAsync(null, null)).ReturnsAsync(tags);

            // Act
            var result = await _controller.GetTags(null, null) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result, "Expected OkObjectResult.");
            Assert.IsInstanceOfType(result.Value, typeof(IEnumerable<TagDto>), "Expected IEnumerable<TagDto>.");
            var resultTags = result.Value as IEnumerable<TagDto>;
            Assert.AreEqual(2, resultTags.Count(), "Should return the correct number of tags.");
        }

        #endregion

        #region GetTag Test

        [TestMethod]
        public async Task GetTag_TagExists_ReturnsTag()
        {
            // Arrange
            var tag = new TagDto
            {
                TagId = 1,
                TagName = "ExistingTag",
                Published = true
            };

            _tagServiceMock.Setup(service => service.GetTagByIdAsync(1)).ReturnsAsync(tag);

            // Act
            var result = await _controller.GetTag(1) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result, "Expected OkObjectResult.");
            Assert.IsInstanceOfType(result.Value, typeof(TagDto), "Expected TagDto.");
            var resultTag = result.Value as TagDto;
            Assert.AreEqual(tag.TagId, resultTag.TagId, "Tag ID should match.");
        }

        [TestMethod]
        public async Task GetTag_TagDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            _tagServiceMock.Setup(service => service.GetTagByIdAsync(1)).ReturnsAsync((TagDto)null);

            // Act
            var result = await _controller.GetTag(1);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundResult), "Expected NotFoundResult.");
        }

        #endregion

        #region UpdateTag Test

        [TestMethod]
        public async Task UpdateTag_TagExists_UpdatesTag()
        {
            // Arrange
            var tagDto = new TagDto
            {
                TagId = 1,
                TagName = "UpdatedTag",
                Published = true
            };

            _tagServiceMock.Setup(service => service.GetTagByIdAsync(1)).ReturnsAsync(tagDto);

            // Act
            var result = await _controller.UpdateTag(1, tagDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NoContentResult), "Expected NoContentResult.");
            _tagServiceMock.Verify(service => service.UpdateTagAsync(tagDto), Times.Once);
        }

        [TestMethod]
        public async Task UpdateTag_TagIdMismatch_ReturnsBadRequest()
        {
            // Arrange
            var tagDto = new TagDto
            {
                TagId = 2, // ID mismatch
                TagName = "UpdatedTag",
                Published = true
            };

            // Act
            var result = await _controller.UpdateTag(1, tagDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult), "Expected BadRequestObjectResult.");
        }

        [TestMethod]
        public async Task UpdateTag_TagDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            var tagDto = new TagDto
            {
                TagId = 1,
                TagName = "UpdatedTag",
                Published = true
            };

            _tagServiceMock.Setup(service => service.GetTagByIdAsync(1)).ReturnsAsync((TagDto)null);

            // Act
            var result = await _controller.UpdateTag(1, tagDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundResult), "Expected NotFoundResult.");
        }

        #endregion

        #region DeleteTag Test

        [TestMethod]
        public async Task DeleteTag_TagExists_DeletesTag()
        {
            // Arrange
            var tag = new TagDto
            {
                TagId = 1,
                TagName = "TagToDelete",
                Published = true
            };

            _tagServiceMock.Setup(service => service.GetTagByIdAsync(1)).ReturnsAsync(tag);

            // Act
            var result = await _controller.DeleteTag(1);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NoContentResult), "Expected NoContentResult.");
            _tagServiceMock.Verify(service => service.DeleteTagAsync(1), Times.Once);
        }

        [TestMethod]
        public async Task DeleteTag_TagDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            _tagServiceMock.Setup(service => service.GetTagByIdAsync(1)).ReturnsAsync((TagDto)null);

            // Act
            var result = await _controller.DeleteTag(1);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundResult), "Expected NotFoundResult.");
        }

        #endregion
    }
}
