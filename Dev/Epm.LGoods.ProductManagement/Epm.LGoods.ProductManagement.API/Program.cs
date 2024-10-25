

using Epm.LGoods.Elmah;
using Epm.LGoods.ProductManagement.Application.Interfaces;
using Epm.LGoods.ProductManagement.Application.Services;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Epm.LGoods.ProductManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("LocalGoods")));


builder.Services.AddElmahLogging(builder.Configuration);


builder.Services.AddScoped<IProductTagRepository, ProductTagRepository>();
builder.Services.AddScoped<IProductTagService, ProductTagService>();

builder.Services.AddScoped<IProductCategoryRepository, ProductCategoryRepository>();
builder.Services.AddScoped<IProductCategoryService, ProductCategoryService>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<IPriceRepository, PriceRepository>();
builder.Services.AddScoped<IPriceService, PriceService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductImageRepository, ProductImageRepository>();
builder.Services.AddScoped<IProductImageService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var blobServiceEndpoint = configuration["AzureBlobStorage:BlobServiceEndpoint"];
    var containerName = configuration["AzureBlobStorage:ContainerName"];
    var sasToken = configuration["AzureBlobStorage:SasToken"];

    return new ProductImageService(
        provider.GetRequiredService<IProductImageRepository>(),
        blobServiceEndpoint,
        containerName,
        sasToken);
});

builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<ITagService, TagService>();

builder.Services.AddScoped<ICategoryService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var blobServiceEndpoint = configuration["AzureBlobStorage:BlobServiceEndpoint"];
    var containerName = configuration["AzureBlobStorage:ContainerName"];
    var sasToken = configuration["AzureBlobStorage:SasToken"];

    return new CategoryService(
        provider.GetRequiredService<ICategoryRepository>(),
        blobServiceEndpoint,
        containerName,
        sasToken);
});

builder.Services.AddScoped<IStatisticsService, StatisticsService>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<IProductImageRepository, ProductImageRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder
            .AllowAnyOrigin()  
            .AllowAnyMethod()  
            .AllowAnyHeader()); 
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/error");
}

app.UseCors("AllowSpecificOrigin");

app.UseAuthorization();

app.UseMiddleware<BasicAuthMiddleware>(builder.Configuration);
app.UseElmahLogging(builder.Configuration);

app.MapControllers();

app.Run();
