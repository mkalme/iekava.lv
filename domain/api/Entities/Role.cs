namespace YourApp.Entity;

public class Role : Entity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public ICollection<Scope> Scopes { get; set; } = new List<Scope>();
}