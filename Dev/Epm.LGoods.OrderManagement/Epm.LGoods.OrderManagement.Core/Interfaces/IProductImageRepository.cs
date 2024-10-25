using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Epm.LGoods.OrderManagement.Core.Entities;

namespace Epm.LGoods.OrderManagement.Core.Interfaces
{
    public interface IProductImageRepository
    {
        Task<ProductImage> GetImageByIdAsync(int imageId);
        Task<IEnumerable<ProductImage>> GetImagesByProductIdAsync(int productId);
    }
}
