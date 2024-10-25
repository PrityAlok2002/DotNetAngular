using Epm.LGoods.ProductManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Core.Interfaces
{
    public  interface IProductTagRepository
    {
        Task AddTagsToProductAsync(int productId, IEnumerable<int> tagIds);
        Task<IEnumerable<Tag>> GetTagsForProductAsync(int productId);
       

    }
}
