namespace YourApp.Entity;

public class Message : Entity
{
    public string? Text { get; set; }
    public Guid AuthorId { get; set; }
    public User? Author { get; set; }

    public Message() { }
    
    public Message(string? text, User? author)
    {
        Text = text;
        AuthorId = author?.Id ?? Guid.Empty;
        Author = author;
    }
}