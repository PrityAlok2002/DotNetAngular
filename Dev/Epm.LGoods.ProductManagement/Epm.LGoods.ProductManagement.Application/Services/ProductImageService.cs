using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using Epm.LGoods.ProductManagement.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Application.Services
{
    public class ProductImageService : IProductImageService
    {
        private readonly IProductImageRepository _productImageRepository;
        private readonly string _blobServiceEndpoint;
        private readonly string _containerName;
        private readonly string _sasToken;

        public ProductImageService(IProductImageRepository productImageRepository, string blobServiceEndpoint, string containerName, string sasToken)
        {
            _productImageRepository = productImageRepository;
            _blobServiceEndpoint = blobServiceEndpoint;
            _containerName = containerName;
            _sasToken = sasToken;
        }

        public async Task<IEnumerable<ProductImage>> GetAllProductImagesAsync()
        {
            return await _productImageRepository.GetAllProductImagesAsync();
        }


        public async Task SaveSelectedImages(int productId, List<string> imageUrls, List<IFormFile> files, string isMain)
        {
            var productImages = new List<ProductImage>();


            await ProcessImageUrls(productId, imageUrls, isMain, productImages);


            await ProcessFiles(productId, files, isMain, productImages);

            await _productImageRepository.SaveProductImages(productImages);
        }

        private async Task ProcessImageUrls(int productId, List<string> imageUrls, string isMain, List<ProductImage> productImages)
        {
            for (int i = 0; i < imageUrls.Count; i++)
            {
                productImages.Add(new ProductImage
                {
                    ImageUrl = imageUrls[i],
                    ProductId = productId,
                    IsMain = isMain == "imageUrl" && i == 0
                });
            }

            await Task.CompletedTask;
        }

        private async Task ProcessFiles(int productId, List<IFormFile> files, string isMain, List<ProductImage> productImages)
        {
            for (int i = 0; i < files.Count; i++)
            {
                var file = files[i];
                var imageUrl = await UploadFileToBlobAsync(file);

                productImages.Add(new ProductImage
                {
                    ImageUrl = imageUrl,
                    ProductId = productId,
                    IsMain = isMain == "image" && i == 0
                });
            }
        }

        public virtual async Task<string> UploadFileToBlobAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return string.Empty;

            var containerClient = new BlobContainerClient(new Uri($"{_blobServiceEndpoint}/{_containerName}?{_sasToken}"));
            var blobClient = containerClient.GetBlobClient(Guid.NewGuid().ToString() + Path.GetExtension(file.FileName));

            await using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, new Azure.Storage.Blobs.Models.BlobUploadOptions
                {
                    HttpHeaders = new Azure.Storage.Blobs.Models.BlobHttpHeaders
                    {
                        ContentType = "image/jpeg"
                    }
                });
            }

            return blobClient.Uri.ToString();
        }
    }
}
