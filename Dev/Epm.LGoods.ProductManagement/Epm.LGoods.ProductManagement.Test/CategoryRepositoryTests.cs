using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Entities.Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Epm.LGoods.ProductManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;


namespace Epm.LGoods.ProductManagement.Test
{
    [TestClass]
    public class CategoryRepositoryTests
    {
        private DbContextOptions<ApplicationDbContext> _dbContextOptions;
        private ApplicationDbContext _context;
        private CategoryRepository _categoryRepository;

        [TestInitialize]
        public void Setup()
        {
            _dbContextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            _context = new ApplicationDbContext(_dbContextOptions);
            _categoryRepository = new CategoryRepository(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [TestMethod]
        public async Task AddCategory_ShouldAddCategory()
        {
            // Arrange
            var category = new Category
            {
                CategoryName = "NewCategory",
                Description = "NewDescription",
                Image = "NewImage",
                IsActive = true
            };

            // Act
            await _categoryRepository.AddCategory(category);

            // Assert
            var addedCategory = _context.Categories.FirstOrDefault(c => c.CategoryName == "NewCategory");
            Assert.IsNotNull(addedCategory);
            Assert.AreEqual("NewDescription", addedCategory.Description);
            Assert.AreEqual("NewImage", addedCategory.Image);
            Assert.IsTrue(addedCategory.IsActive);
        }

        [TestMethod]
        public async Task GetAllCategories_ShouldReturnAllCategories()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category { CategoryName = "Category1", Description = "Description1", Image = "Image1", IsActive = true },
                new Category { CategoryName = "Category2", Description = "Description2", Image = "Image2", IsActive = true }
            };

            await _context.Categories.AddRangeAsync(categories);
            await _context.SaveChangesAsync();

            // Act
            var result = await _categoryRepository.GetAllCategories();

            // Assert
            Assert.AreEqual(2, result.Count());
        }

        [TestMethod]
        public async Task GetCategoryByName_ShouldReturnTrue_WhenCategoryExists()
        {
            // Arrange
            var category = new Category { CategoryName = "ExistingCategory", Description = "Description", Image = "Image", IsActive = true };
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();

            // Act
            var result = await _categoryRepository.GetCategoryByName("ExistingCategory");

            // Assert
            Assert.IsTrue(result);
        }

        [TestMethod]
        public async Task GetCategoryByName_ShouldReturnFalse_WhenCategoryDoesNotExist()
        {
            // Arrange
            var category = new Category { CategoryName = "ExistingCategory", Description = "Description", Image = "Image", IsActive = true };
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();

            // Act
            var result = await _categoryRepository.GetCategoryByName("NonExistingCategory");

            // Assert
            Assert.IsFalse(result);
        }
        [TestMethod]
        public async Task GetCategoryById_ShouldReturnCategory_WhenCategoryExists()
        {
            // Arrange
            var category = new Category { CategoryId = 1, CategoryName = "ExistingCategory", Description = "Description", Image = "Image", IsActive = true };
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();

            // Act
            var result = await _categoryRepository.GetCategoryById(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("ExistingCategory", result.CategoryName);
            Assert.AreEqual("Description", result.Description);
            Assert.AreEqual("Image", result.Image);
            Assert.IsTrue(result.IsActive);
        }

        [TestMethod]
        public async Task GetCategoryById_ShouldReturnNull_WhenCategoryDoesNotExist()
        {
            // Arrange
            var category = new Category { CategoryId = 1, CategoryName = "ExistingCategory", Description = "Description", Image = "Image", IsActive = true };
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();

            // Act
            var result = await _categoryRepository.GetCategoryById(2);

            // Assert
            Assert.IsNull(result);
        }

        [TestMethod]
        public async Task UpdateCategory_ShouldUpdateCategory()
        {
            // Arrange
            var category = new Category { CategoryId = 1, CategoryName = "ExistingCategory", Description = "Description", Image = "Image", IsActive = true };
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();

            category.Description = "UpdatedDescription";
            category.Image = "UpdatedImage";
            category.IsActive = false;

            // Act
            await _categoryRepository.UpdateCategory(category);

            // Assert
            var updatedCategory = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == 1);
            Assert.IsNotNull(updatedCategory);
            Assert.AreEqual("UpdatedDescription", updatedCategory.Description);
            Assert.AreEqual("UpdatedImage", updatedCategory.Image);
            Assert.IsFalse(updatedCategory.IsActive);
        }

        [TestMethod]
        public async Task CountAsync_ShouldReturnNumberOfCategories()
        {
            var categories = new List<Category>
            {
                new Category { CategoryName = "Category1", Description = "Description1", Image = "Image1", IsActive = true },
                new Category { CategoryName = "Category2", Description = "Description2", Image = "Image2", IsActive = true },
                new Category { CategoryName = "Category3", Description = "Description3", Image = "Image3", IsActive = true }
            };

            await _context.Categories.AddRangeAsync(categories);
            await _context.SaveChangesAsync();

            var count = await _categoryRepository.CountAsync();

            Assert.AreEqual(3, count); 
        }


    }
}
