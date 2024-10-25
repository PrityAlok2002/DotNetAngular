using Epm.LGoods.Elmah;
using Epm.LGoods.IdentityService.Application.Services;
using Epm.LGoods.IdentityService.Core.Interfaces;
using Epm.LGoods.IdentityService.Infrastructure.Data;
using Epm.LGoods.IdentityService.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("LocalGoods")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IVendorDetailsRepository, VendorDetailsRepository>();
builder.Services.AddScoped<IVendorApprovalService, VendorApprovalService>();
builder.Services.AddScoped<IRegistrationService, RegistrationService>();


builder.Services.AddControllers();
builder.Services.AddAuthorization();


builder.Services.AddElmahLogging(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/error");
}

app.UseCors("AllowAllOrigins");

app.UseRouting();
app.UseAuthorization();
app.UseMiddleware<BasicAuthMiddleware>(builder.Configuration);
app.UseElmahLogging(builder.Configuration);

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.Migrate();
        context.SeedData();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred seeding the DB.");
    }
}

app.Run();
