namespace YourApp.Entity;

public class Role(string id) : Entity<string>(id)
{
    public string? Description { get; set; }
    public ICollection<Scope> Scopes { get; set; } = [];
}