using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Core.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Application.Interfaces
{
    public interface IProductImageService
    {
        Task<IEnumerable<ProductImage>> GetAllProductImagesAsync();

        Task SaveSelectedImages(int productId, List<string> imageUrls, List<IFormFile> files, string isMain);
    }
}
