using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Application.Interfaces
{
    public interface IProductTagService
    {
        Task AddTagsToProductAsync(AddTagsToProductDto dto);
        Task<IEnumerable<Tag>> GetTagsForProductAsync(int productId);
       
        Task<IEnumerable<Tag>> GetAllTagsAsync();  // Add this method
    }
}
