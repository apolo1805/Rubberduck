namespace Rubberduck.Api.Models;

public class ReviewComment
{
    public Guid Id { get; set; }
    public Guid SubmissionId { get; set; }
    public Submission Submission { get; set; } = null!;
    public int LineNumber { get; set; }
    public string Content { get; set; } = null!;
    public SeverityLevel Severity { get; set; }
}

public enum SeverityLevel { Info, Warning, Error }