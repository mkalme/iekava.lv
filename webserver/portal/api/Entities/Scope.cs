namespace YourApp.Entity;

public class Scope(string id) : Entity<string>(id)
{
    public string? Description { get; set; }
}