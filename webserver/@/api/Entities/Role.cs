namespace YourApp.Entity;

public class Role(string name) : Entity
{
    public string Name { get; set; } = name;
    public string? Description { get; set; }
    public ICollection<Scope> Scopes { get; set; } = [];
}