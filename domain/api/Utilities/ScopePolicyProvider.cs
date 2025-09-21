using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace YourApp.Utilities;

public class ScopePolicyProvider : IAuthorizationPolicyProvider
{
    private readonly DefaultAuthorizationPolicyProvider _fallbackPolicyProvider;
    private readonly IServiceProvider _serviceProvider;
    private readonly Dictionary<string, AuthorizationPolicy> _cache = new();

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
            var scopeName = policyName.Substring("Scope:".Length);

            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var exists = await db.Scopes.AnyAsync(s => s.Name == scopeName);

            if (exists)
            {
                policy = new AuthorizationPolicyBuilder()
                    .RequireClaim("scope", scopeName)
                    .Build();

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