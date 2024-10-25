using Azure.Storage.Blobs;
using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Core.Entities.Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Epm.LGoods.ProductManagement.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly string _blobServiceEndpoint;
        private readonly string _containerName;
        private readonly string _sasToken;

        public CategoryService(ICategoryRepository categoryRepository, string blobServiceEndpoint, string containerName, string sasToken)
        {
            _categoryRepository = categoryRepository;
            _blobServiceEndpoint = blobServiceEndpoint;
            _containerName = containerName;
            _sasToken = sasToken;
        }

        public async Task<IEnumerable<Category>> GetAllCategories()
        {
            return await _categoryRepository.GetAllCategories();
        }

        public async Task<bool> GetCategoryByName(string name)
        {
            return await _categoryRepository.GetCategoryByName(name);
        }

        public async Task AddCategory(CategoryDto categoryDto)
        {
            string imageUrl = null;

            if (categoryDto.Image != null)
            {
                imageUrl = await UploadFileToBlob(categoryDto.Image);
            }

            Category category = new Category
            {
                CategoryName = categoryDto.CategoryName,
                Description = categoryDto.Description,
                Image = imageUrl,
                IsActive = categoryDto.Status
            };

            await _categoryRepository.AddCategory(category);
        }

        public async Task<Category> GetCategoryById(int id)
        {
            return await _categoryRepository.GetCategoryById(id);
        }

        public async Task UpdateCategory(int id, CategoryDto categoryDto)
        {
            var existingCategory = await _categoryRepository.GetCategoryById(id);
            if (existingCategory == null)
            {
                throw new Exception("Category not found");
            }

            string imageUrl = existingCategory.Image;

            if (categoryDto.Image != null)
            {
                imageUrl = await UploadFileToBlob(categoryDto.Image);
            }

            existingCategory.CategoryName = categoryDto.CategoryName;
            existingCategory.Description = categoryDto.Description;
            existingCategory.Image = imageUrl;
            existingCategory.IsActive = categoryDto.Status;

            await _categoryRepository.UpdateCategory(existingCategory);
        }

        public virtual async Task<string> UploadFileToBlob(IFormFile file)
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
