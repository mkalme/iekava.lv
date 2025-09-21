using Microsoft.EntityFrameworkCore;
using YourApp.Entity;

namespace YourApp;

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Scope> Scopes { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}