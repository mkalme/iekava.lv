using Microsoft.EntityFrameworkCore;
using YourApp;
using YourApp.Extensions;
using YourApp.Utilities;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure services using extension methods
builder.Services.ConfigureAuthentication(builder.Configuration);
builder.Services.ConfigureCors();
builder.Services.ConfigureServices();

// Register the dynamic ScopePolicyProvider BEFORE building the app
builder.Services.AddSingleton<IAuthorizationPolicyProvider, ScopePolicyProvider>();

var app = builder.Build();

// Configure pipeline
app.ConfigurePipeline();

app.Run();