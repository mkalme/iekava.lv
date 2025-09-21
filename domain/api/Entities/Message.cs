namespace YourApp.Entity;

public class Message : Entity
{
    public string? Value { get; set; }
    public Guid AuthorId { get; set; }
    public User Author { get; set; }
}