using Microsoft.AspNetCore.Authorization;

namespace YourApp.Utilities;

public class AuthorizeScopesAttribute : AuthorizeAttribute
{
    public AuthorizeScopesAttribute(params string[] scopes)
    {
        Policy = $"Scope:{string.Join(';', scopes)}";
    }
}