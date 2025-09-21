namespace YourApp.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        // CORS should come early in the pipeline
        app.UseCors("SecurePolicy");
        
        // Authentication & Authorization
        app.UseAuthentication();
        app.UseAuthorization();
        
        // Map controllers and endpoints
        app.MapControllers();

        return app;
    }
}