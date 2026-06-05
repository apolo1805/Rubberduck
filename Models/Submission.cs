namespace Rubberduck.Api.Models;

public class Submission
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Title { get; set; } = null!;
    public string Language { get; set; } = null!;
    public string Code { get; set; } = null!;
    public ICollection<ReviewComment> ReviewComments { get; set; } = new List<ReviewComment>();
    public Status Status { get; set; }
}

public enum Status { Pending, Reviewing, Done }