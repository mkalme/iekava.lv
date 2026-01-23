using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace YourApp.Utilities;

public class ScopePolicyProvider : IAuthorizationPolicyProvider
{
    private readonly DefaultAuthorizationPolicyProvider _fallbackPolicyProvider;
    private readonly IServiceProvider _serviceProvider;
    private readonly Dictionary<string, AuthorizationPolicy> _cache = [];

    public ScopePolicyProvider(IOptions<AuthorizationOptions> options, IServiceProvider serviceProvider)
    {
        _fallbackPolicyProvider = new DefaultAuthorizationPolicyProvider(options);
        _serviceProvider = serviceProvider;
    }

    public async Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
    {
        if (_cache.TryGetValue(policyName, out var policy)) return policy;

        if (policyName.StartsWith("Scope:"))
        {
            var scopeNames = policyName.Substring("Scope:".Length)
                .Split(';')
                .Select(x => x.Trim().ToLower())
                .ToList();
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var exists = await db.Scopes.AnyAsync(s => scopeNames.Contains(s.Id));
            if (exists)
            {
                var builder = new AuthorizationPolicyBuilder();
                builder.RequireAssertion(context =>
                    context.User.Claims
                        .Where(c => c.Type == "scope")
                        .Select(c => c.Value.ToLower())
                        .Any(c => scopeNames.Contains(c))
                );

                policy = builder.Build();
                _cache[policyName] = policy;
                return policy;
            }
        }

        return null;
    }

    public Task<AuthorizationPolicy> GetDefaultPolicyAsync()
    {
        return _fallbackPolicyProvider.GetDefaultPolicyAsync();
    }

    public Task<AuthorizationPolicy?> GetFallbackPolicyAsync()
    {
        return _fallbackPolicyProvider.GetFallbackPolicyAsync();
    }
}