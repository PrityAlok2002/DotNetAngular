using Epm.LGoods.Elmah;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//        options.UseSqlServer(builder.Configuration.GetConnectionString("LocalGoods")));
builder.Services.AddElmahLogging(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/error");
}

app.UseAuthorization();
app.UseMiddleware<BasicAuthMiddleware>(builder.Configuration);
app.UseElmahLogging(builder.Configuration);

app.MapControllers();

app.Run();
