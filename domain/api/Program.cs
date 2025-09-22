using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using YourApp;
using YourApp.Extensions;
using YourApp.Utilities;
using YourApp.Entity;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.ConfigureAuthentication(builder.Configuration);
builder.Services.ConfigureCors();
builder.Services.ConfigureServices();
builder.Services.AddSingleton<IAuthorizationPolicyProvider, ScopePolicyProvider>();

var app = builder.Build();
app.UseCors("SecurePolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();