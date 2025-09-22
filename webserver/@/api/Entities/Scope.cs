namespace YourApp.Entity;

public class Scope(string name) : Entity()
{
    public string Name { get; set; } = name;
    public string? Description { get; set; }
}