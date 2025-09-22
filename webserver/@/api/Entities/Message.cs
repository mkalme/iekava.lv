namespace YourApp.Entity;

public class Message() : Entity
{
    public string? Text { get; set; }
    public Guid AuthorId { get; set; }
    public User? Author { get; set; }
}