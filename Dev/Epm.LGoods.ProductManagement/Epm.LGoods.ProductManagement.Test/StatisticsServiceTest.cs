using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Threading.Tasks;
using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Services;
using Epm.LGoods.ProductManagement.Core.Interfaces;

namespace Epm.LGoods.ProductManagement.Application.Tests
{
    [TestClass]
    public class StatisticsServiceTest
    {
        private Mock<IProductRepository> _productRepoMock;
        private Mock<ICategoryRepository> _categoryRepoMock;
        private Mock<ITagRepository> _tagRepoMock;
        private Mock<IProductImageRepository> _imageRepoMock;
        private StatisticsService _service;

        [TestInitialize]
        public void Setup()
        {
            _productRepoMock = new Mock<IProductRepository>();
            _categoryRepoMock = new Mock<ICategoryRepository>();
            _tagRepoMock = new Mock<ITagRepository>();
            _imageRepoMock = new Mock<IProductImageRepository>();

            _service = new StatisticsService(
                _productRepoMock.Object,
                _categoryRepoMock.Object,
                _tagRepoMock.Object,
                _imageRepoMock.Object
            );
        }

        [TestMethod]
        public async Task GetStatisticsAsync_ReturnsCorrectStatistics()
        {
            _productRepoMock.Setup(repo => repo.CountAsync()).ReturnsAsync(100);
            _categoryRepoMock.Setup(repo => repo.CountAsync()).ReturnsAsync(20);
            _tagRepoMock.Setup(repo => repo.CountAsync()).ReturnsAsync(10);
            _imageRepoMock.Setup(repo => repo.CountAsync()).ReturnsAsync(50);

            var result = await _service.GetStatisticsAsync();

            Assert.AreEqual(100, result.TotalProducts);
            Assert.AreEqual(20, result.TotalCategories);
            Assert.AreEqual(10, result.TotalTags);
            Assert.AreEqual(50, result.TotalImages);
        }
    }
}
