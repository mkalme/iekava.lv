using YourApp.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Configure services using extension methods
builder.Services.ConfigureAuthentication(builder.Configuration);
builder.Services.ConfigureCors();
builder.Services.ConfigureServices();

var app = builder.Build();

// Configure pipeline
app.ConfigurePipeline();

app.Run();