using Epm.LGoods.ProductManagement.Core.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Core.Interfaces
{
    public interface IProductImageRepository
    {
        Task<IEnumerable<ProductImage>> GetAllProductImagesAsync();

        //Task<bool> SaveProductImagesAsync(int productId, string imagesData);

        //Task SaveProductImage(int productId, string imageUrl, bool isMain);

        Task SaveProductImages(List<ProductImage> productImages);

        Task<int> CountAsync();
    }
}
