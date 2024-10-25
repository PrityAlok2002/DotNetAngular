
using Epm.LGoods.Elmah;
using Epm.LGoods.ShippingService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configure Entity Framework and SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("LocalGoods")));

builder.Services.AddControllers();
builder.Services.AddAuthorization();


// Add ELMAH logging services
builder.Services.AddElmahLogging(builder.Configuration);

// Register repositories and services


// Configure Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder
            .AllowAnyOrigin()  // Allow all origins
            .AllowAnyMethod()  // Allow all HTTP methods
            .AllowAnyHeader()); // Allow all headers
});

var app = builder.Build();

// Configure the HTTP request pipeline
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

// Use CORS policy
app.UseCors("AllowSpecificOrigin");

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<BasicAuthMiddleware>(builder.Configuration);
app.UseElmahLogging(builder.Configuration);

// Map controllers to routes
app.MapControllers();

// Run the application
app.Run();
