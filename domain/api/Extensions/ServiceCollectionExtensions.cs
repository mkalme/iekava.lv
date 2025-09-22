using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using YourApp.Services;
using YourApp.Utilities;

namespace YourApp.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection ConfigureServices(this IServiceCollection services)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        
        return services;
    }

    public static IServiceCollection ConfigureAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = JwtSecretKeyProvider.GetKey(),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
                
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var token = context.Request.Cookies["authToken"];
                        if (!string.IsNullOrEmpty(token))
                        {
                            context.Token = token;
                        }

                        else if (context.Request.Headers.TryGetValue("Authorization", out StringValues value))
                        {
                            var authHeader = value.FirstOrDefault();
                            if (authHeader?.StartsWith("Bearer ") == true)
                            {
                                context.Token = authHeader.Substring("Bearer ".Length).Trim();
                            }
                        }
                        return Task.CompletedTask;
                    }
                };
            });
            
        return services;
    }
    
    public static IServiceCollection ConfigureCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("SecurePolicy", policy =>
            {
                policy
                    .WithOrigins(
                        "https://iekava.lv",
                        "http://localhost:5000")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });
        
        return services;
    }
}