using Microsoft.EntityFrameworkCore;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Epm.LGoods.ProductManagement.Infrastructure.Repositories;

namespace Epm.LGoods.ProductManagement.Test
{
    [TestClass]
    public class TagRepositoryTests
    {
        private ApplicationDbContext _context;
        private TagRepository _repository;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Unique database for each test
                .Options;

            _context = new ApplicationDbContext(options);
            _repository = new TagRepository(_context);
        }

        #region AddTagAsync Tests

        [TestMethod]
        public async Task AddTagAsync_ValidTag_AddsTagToDatabase()
        {
            // Arrange
            var tag = new Tag
            {
                TagName = "NewTag",
                Published = true
            };

            // Act
            await _repository.AddTagAsync(tag);

            // Assert
            var savedTag = await _context.Tags.FirstOrDefaultAsync(t => t.TagName == "NewTag");
            Assert.IsNotNull(savedTag, "Tag should have been added to the database.");
            Assert.AreEqual(tag.TagName, savedTag.TagName, "TagName should match.");
            Assert.AreEqual(tag.Published, savedTag.Published, "Published status should match.");
        }

        [TestMethod]
        public async Task AddTagAsync_ShouldHandleNullTag()
        {
            // Act & Assert
            await Assert.ThrowsExceptionAsync<ArgumentNullException>(() => _repository.AddTagAsync(null));
        }

        

        #endregion

        #region GetTagsAsync Tests

        [TestMethod]
        public async Task GetTagsAsync_ShouldReturnFilteredTags()
        {
            // Arrange
            _context.Tags.AddRange(
                new Tag { TagName = "Tag1", Published = true },
                new Tag { TagName = "Tag2", Published = true }
            );
            await _context.SaveChangesAsync();

            // Act
            var tags = await _repository.GetTagsAsync("Tag1", null);

            // Assert
            Assert.AreEqual(1, tags.Count(), "Filter by TagName should return the correct number of tags.");
            Assert.AreEqual("Tag1", tags.First().TagName, "TagName should match.");
        }

        [TestMethod]
        public async Task GetTagsAsync_ShouldReturnTagsByPublishedStatus()
        {
            // Arrange
            _context.Tags.AddRange(
                new Tag { TagName = "Tag1", Published = true },
                new Tag { TagName = "Tag2", Published = false }
            );
            await _context.SaveChangesAsync();

            // Act
            var tags = await _repository.GetTagsAsync(null, false);

            // Assert
            Assert.AreEqual(1, tags.Count(), "Filter by Published status should return the correct number of tags.");
            Assert.AreEqual("Tag2", tags.First().TagName, "TagName should match.");
        }

        [TestMethod]
        public async Task GetTagsAsync_ShouldReturnFilteredTagsByNameAndPublishedStatus()
        {
            // Arrange
            _context.Tags.AddRange(
                new Tag { TagName = "Tag1", Published = true },
                new Tag { TagName = "Tag1", Published = false },
                new Tag { TagName = "Tag2", Published = true }
            );
            await _context.SaveChangesAsync();

            // Act
            var tags = await _repository.GetTagsAsync("Tag1", true);

            // Assert
            Assert.AreEqual(1, tags.Count(), "Filter by TagName and Published status should return the correct number of tags.");
            Assert.AreEqual("Tag1", tags.First().TagName, "TagName should match.");
            Assert.IsTrue(tags.First().Published, "Published status should match.");
        }

        [TestMethod]
        public async Task GetTagsAsync_ShouldReturnNoTagsForNonMatchingCriteria()
        {
            // Act
            var tags = await _repository.GetTagsAsync("NonExistent", null);

            // Assert
            Assert.AreEqual(0, tags.Count(), "Non-matching criteria should return no tags.");
        }

        #endregion

        #region GetTagByIdAsync Tests

        [TestMethod]
        public async Task GetTagByIdAsync_TagExists_ReturnsTag()
        {
            // Arrange
            var tag = new Tag
            {
                TagName = "Tag1",
                Published = true
            };
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetTagByIdAsync(tag.TagId);

            // Assert
            Assert.IsNotNull(result, "Tag should be retrieved from the database.");
            Assert.AreEqual(tag.TagName, result.TagName, "TagName should match.");
        }

        [TestMethod]
        public async Task GetTagByIdAsync_ShouldReturnNullForNonExistentTag()
        {
            // Act
            var result = await _repository.GetTagByIdAsync(999); // Assuming 999 does not exist

            // Assert
            Assert.IsNull(result, "Non-existent Tag should return null.");
        }

        [TestMethod]
        public async Task GetTagByIdAsync_ShouldHandleNegativeId()
        {
            // Act
            var result = await _repository.GetTagByIdAsync(-1); // Assuming negative IDs are invalid

            // Assert
            Assert.IsNull(result, "Negative IDs should return null.");
        }

        [TestMethod]
        public async Task GetTagByIdAsync_ShouldHandleEmptyDatabase()
        {
            // Act
            var result = await _repository.GetTagByIdAsync(1); // Assuming ID 1 does not exist

            // Assert
            Assert.IsNull(result, "Empty database should return null for any ID.");
        }

        #endregion

        #region UpdateTagAsync Tests

        [TestMethod]
        public async Task UpdateTagAsync_ValidTag_UpdatesTagInDatabase()
        {
            // Arrange
            var tag = new Tag
            {
                TagName = "OldTag",
                Published = true
            };
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            // Act
            tag.TagName = "UpdatedTag";
            await _repository.UpdateTagAsync(tag);

            // Assert
            var updatedTag = await _context.Tags.FirstOrDefaultAsync(t => t.TagName == "UpdatedTag");
            Assert.IsNotNull(updatedTag, "Tag should be updated in the database.");
            Assert.AreEqual("UpdatedTag", updatedTag.TagName, "TagName should be updated.");
        }

        

        [TestMethod]
        public async Task UpdateTagAsync_ShouldHandleNonExistentTag()
        {
            // Arrange
            var tag = new Tag
            {
                TagId = 999, // Assuming ID 999 does not exist
                TagName = "NonExistent",
                Published = true
            };

            // Act & Assert
            await Assert.ThrowsExceptionAsync<DbUpdateConcurrencyException>(() => _repository.UpdateTagAsync(tag));
        }

        #endregion

        #region DeleteTagAsync Tests

        [TestMethod]
        public async Task DeleteTagAsync_ValidTagId_DeletesTagFromDatabase()
        {
            // Arrange
            var tag = new Tag
            {
                TagName = "TagToDelete",
                Published = true
            };
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            // Act
            await _repository.DeleteTagAsync(tag.TagId);

            // Assert
            var deletedTag = await _context.Tags.FirstOrDefaultAsync(t => t.TagName == "TagToDelete");
            Assert.IsNull(deletedTag, "Tag should be deleted from the database.");
        }

        [TestMethod]
        public async Task DeleteTagAsync_ShouldHandleNonExistentTag()
        {
            // Act
            await _repository.DeleteTagAsync(999); // Assuming ID 999 does not exist

            // Assert
            // No exception should be thrown
        }

      
        

        [TestMethod]
        public async Task DeleteTagAsync_ShouldHandleMultipleDeletes()
        {
            // Arrange
            var tag = new Tag
            {
                TagName = "TagToDelete",
                Published = true
            };
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            // Act
            await _repository.DeleteTagAsync(tag.TagId);
            await _repository.DeleteTagAsync(tag.TagId); // Deleting again

            // Assert
            var deletedTag = await _context.Tags.FirstOrDefaultAsync(t => t.TagName == "TagToDelete");
            Assert.IsNull(deletedTag, "Tag should be deleted from the database.");
        }

        #endregion


        [TestMethod]
        public async Task CountAsync_ReturnsCorrectCount_WithInitialData()
        {
            _context.Tags.AddRange(
                new Tag { TagName = "Tag1", Published = true },
                new Tag { TagName = "Tag2", Published = false }
            );
            await _context.SaveChangesAsync();

            var count = await _repository.CountAsync();

            Assert.AreEqual(2, count, "CountAsync should return the correct number of tags.");
        }

        [TestMethod]
        public async Task CountAsync_ReturnsCorrectCount_AfterAddingTags()
        {
            _context.Tags.AddRange(
                new Tag { TagName = "Tag1", Published = true },
                new Tag { TagName = "Tag2", Published = false }
            );
            await _context.SaveChangesAsync();

            await _repository.AddTagAsync(new Tag { TagName = "Tag3", Published = true });
            await _repository.AddTagAsync(new Tag { TagName = "Tag4", Published = false });

            var count = await _repository.CountAsync();

            Assert.AreEqual(4, count, "CountAsync should reflect the added tags.");
        }

        [TestMethod]
        public async Task CountAsync_ReturnsCorrectCount_AfterDeletingTags()
        {
            _context.Tags.AddRange(
                new Tag { TagName = "Tag1", Published = true },
                new Tag { TagName = "Tag2", Published = false },
                new Tag { TagName = "Tag3", Published = true }
            );
            await _context.SaveChangesAsync();

            var tagToDelete = await _context.Tags.FirstAsync(t => t.TagName == "Tag2");
            await _repository.DeleteTagAsync(tagToDelete.TagId);

            var count = await _repository.CountAsync();

            Assert.AreEqual(2, count, "CountAsync should reflect the deleted tag.");
        }

        [TestMethod]
        public async Task CountAsync_ReturnsZero_WithNoTags()
        {
            var count = await _repository.CountAsync();

            Assert.AreEqual(0, count, "CountAsync should return 0 when no tags are present.");
        }

    }
}
