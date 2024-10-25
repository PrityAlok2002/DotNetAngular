using Epm.LGoods.ProductManagement.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Application.Interfaces
{
    public interface IStatisticsService
    {
        Task<StatisticsDto> GetStatisticsAsync();

    }
}
