namespace YourApp.Entity;

public class Entity<TID>
{
    public TID Id { get; set; }

    public Entity(TID id)
    {
        Id = id;
    }
}

public class Entity : Entity<Guid>
{
    public Entity() : base(Guid.NewGuid()) { }
}