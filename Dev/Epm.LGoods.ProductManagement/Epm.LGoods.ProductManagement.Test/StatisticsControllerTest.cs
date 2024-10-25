using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Threading.Tasks;
using Epm.LGoods.ProductManagement.API.Controllers;
using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Interfaces;

namespace Epm.LGoods.ProductManagement.API.Tests
{
    [TestClass]
    public class StatisticsControllerTest
    {
        private Mock<IStatisticsService> _statisticsServiceMock;
        private StatisticsController _controller;

        [TestInitialize]
        public void Setup()
        {
            _statisticsServiceMock = new Mock<IStatisticsService>();
            _controller = new StatisticsController(_statisticsServiceMock.Object);
        }

        [TestMethod]
        public async Task GetStatistics_ReturnsOkResult_WithStatistics()
        {
            var expectedStatistics = new StatisticsDto
            {
                TotalProducts = 100,
                TotalCategories = 20,
                TotalTags = 10,
                TotalImages = 50
            };
            _statisticsServiceMock.Setup(service => service.GetStatisticsAsync()).ReturnsAsync(expectedStatistics);

            var result = await _controller.GetStatistics();

            var actionResult = result as ActionResult<StatisticsDto>;
            Assert.IsNotNull(actionResult);

            var okResult = actionResult.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);

            var actualStatistics = okResult.Value as StatisticsDto;
            Assert.IsNotNull(actualStatistics);
            Assert.AreEqual(expectedStatistics.TotalProducts, actualStatistics.TotalProducts);
            Assert.AreEqual(expectedStatistics.TotalCategories, actualStatistics.TotalCategories);
            Assert.AreEqual(expectedStatistics.TotalTags, actualStatistics.TotalTags);
            Assert.AreEqual(expectedStatistics.TotalImages, actualStatistics.TotalImages);
        }
    }
}
