using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Services;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;

namespace Epm.LGoods.ProductManagement.Test
{
    [TestClass]
    public class TagServiceTests
    {
        private Mock<ITagRepository> _tagRepositoryMock;
        private TagService _service;

        [TestInitialize]
        public void Setup()
        {
            _tagRepositoryMock = new Mock<ITagRepository>();
            _service = new TagService(_tagRepositoryMock.Object);
        }

        #region AddTagAsync Test

        [TestMethod]
        public async Task AddTagAsync_ValidTag_AddsTag()
        {
            // Arrange
            var tagDto = new TagDto
            {
                TagId = 1,
                TagName = "NewTag",
                TaggedProducts = 10,
                Published = true
            };

            var expectedTag = new Tag
            {
                TagName = tagDto.TagName,
                TaggedProducts = tagDto.TaggedProducts,
                Published = tagDto.Published
            };

            // Act
            await _service.AddTagAsync(tagDto);

            // Assert
            _tagRepositoryMock.Verify(repo => repo.AddTagAsync(It.Is<Tag>(t =>
                t.TagName == expectedTag.TagName &&
                t.TaggedProducts == expectedTag.TaggedProducts &&
                t.Published == expectedTag.Published
            )), Times.Once);
        }

        #endregion

        #region GetTagsAsync Test

        [TestMethod]
        public async Task GetTagsAsync_ReturnsTags()
        {
            // Arrange
            var tags = new List<Tag>
            {
                new Tag { TagId = 1, TagName = "Tag1", TaggedProducts = 5, Published = true },
                new Tag { TagId = 2, TagName = "Tag2", TaggedProducts = 10, Published = false }
            };

            _tagRepositoryMock.Setup(repo => repo.GetTagsAsync(null, null)).ReturnsAsync(tags);

            // Act
            var result = await _service.GetTagsAsync(null, null);

            // Assert
            Assert.IsNotNull(result, "Expected result to be not null.");
            Assert.AreEqual(2, result.Count(), "Expected two tags.");
            Assert.AreEqual("Tag1", result.First().TagName, "Expected TagName to match.");
        }

        #endregion

        #region GetTagByIdAsync Test

        [TestMethod]
        public async Task GetTagByIdAsync_TagExists_ReturnsTag()
        {
            // Arrange
            var tag = new Tag
            {
                TagId = 1,
                TagName = "ExistingTag",
                TaggedProducts = 5,
                Published = true
            };

            _tagRepositoryMock.Setup(repo => repo.GetTagByIdAsync(1)).ReturnsAsync(tag);

            // Act
            var result = await _service.GetTagByIdAsync(1);

            // Assert
            Assert.IsNotNull(result, "Expected result to be not null.");
            Assert.AreEqual(tag.TagId, result.TagId, "Expected TagId to match.");
            Assert.AreEqual(tag.TagName, result.TagName, "Expected TagName to match.");
        }

        [TestMethod]
        public async Task GetTagByIdAsync_TagDoesNotExist_ReturnsNull()
        {
            // Arrange
            var nonExistentTagId = 999; // Ensure this ID does not exist in your setup

            // Set up the mock to return null for the non-existent tag ID
            _tagRepositoryMock
                .Setup(repo => repo.GetTagByIdAsync(nonExistentTagId))
                .ReturnsAsync((Tag)null);

            // Act
            var result = await _service.GetTagByIdAsync(nonExistentTagId);

            // Assert
            Assert.IsNull(result, "Expected result to be null when tag does not exist.");
        }

        #endregion

        #region UpdateTagAsync Test

        [TestMethod]
        public async Task UpdateTagAsync_TagExists_UpdatesTag()
        {
            // Arrange
            var tagDto = new TagDto
            {
                TagId = 1,
                TagName = "UpdatedTag",
                TaggedProducts = 10,
                Published = true
            };

            var existingTag = new Tag
            {
                TagId = 1,
                TagName = "OldTag",
                TaggedProducts = 5,
                Published = false
            };

            _tagRepositoryMock.Setup(repo => repo.GetTagByIdAsync(1)).ReturnsAsync(existingTag);

            // Act
            await _service.UpdateTagAsync(tagDto);

            // Assert
            Assert.AreEqual(tagDto.TagName, existingTag.TagName, "Expected TagName to be updated.");
            Assert.AreEqual(tagDto.TaggedProducts, existingTag.TaggedProducts, "Expected TaggedProducts to be updated.");
            Assert.AreEqual(tagDto.Published, existingTag.Published, "Expected Published to be updated.");
            _tagRepositoryMock.Verify(repo => repo.UpdateTagAsync(existingTag), Times.Once);
        }

        [TestMethod]
        public async Task UpdateTagAsync_TagDoesNotExist_DoesNotUpdate()
        {
            // Arrange
            var tagDto = new TagDto
            {
                TagId = 1,
                TagName = "UpdatedTag",
                TaggedProducts = 10,
                Published = true
            };

            _tagRepositoryMock.Setup(repo => repo.GetTagByIdAsync(1)).ReturnsAsync((Tag)null);

            // Act
            await _service.UpdateTagAsync(tagDto);

            // Assert
            _tagRepositoryMock.Verify(repo => repo.UpdateTagAsync(It.IsAny<Tag>()), Times.Never);
        }

        #endregion

        #region DeleteTagAsync Test

        [TestMethod]
        public async Task DeleteTagAsync_TagExists_DeletesTag()
        {
            // Arrange
            var tagId = 1;

            // Act
            await _service.DeleteTagAsync(tagId);

            // Assert
            _tagRepositoryMock.Verify(repo => repo.DeleteTagAsync(tagId), Times.Once);
        }

        #endregion
    }
}
