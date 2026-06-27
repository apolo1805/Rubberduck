using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rubberduck.Api;
using Rubberduck.Api.Models;

namespace Rubberduck.Controllers;

[ApiController]
[Route("[controller]")]
public class SubmissionsController : ControllerBase
{
    private readonly DbContextApp _dbContext;

    public SubmissionsController(DbContextApp dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public IActionResult GetSubmissions()
    {
        var submissions = _dbContext.Submissions.ToList();
        return Ok(submissions);
    }

    [HttpPost]
    public IActionResult CreateSubmission(Submission submission)
    {
        submission.Id = Guid.NewGuid();
        submission.CreatedAt = DateTime.UtcNow;
        _dbContext.Submissions.Add(submission);
        _dbContext.SaveChanges();
        return CreatedAtAction(nameof(GetSubmission), new { id = submission.Id }, submission);
    }

    [HttpGet("{id}")]
    public IActionResult GetSubmission(Guid id)
    {
        var submission = _dbContext.Submissions
            .Include(s => s.ReviewComments)
            .FirstOrDefault(s => s.Id == id);

        if (submission == null)
        {
            return NotFound();
        }
        return Ok(submission);
    }

    [HttpGet("{id}/comments")]
    public IActionResult GetSubmissionComments(Guid id)
    {
        var submission = _dbContext.Submissions.Find(id);

        if (submission == null)
        {
            return NotFound();
        }

        var comments = _dbContext.ReviewComments
            .Where(comment => comment.SubmissionId == id)
            .ToList();

        return Ok(comments);
    }

    [HttpPost("{id}/comments")]
    public IActionResult CreateCommentForSubmission(Guid id, ReviewComment reviewComment)
    {
        var submission = _dbContext.Submissions.Find(id);

        if (submission == null)
        {
            return NotFound();
        }

        reviewComment.Id = Guid.NewGuid();
        reviewComment.SubmissionId = id;
        _dbContext.ReviewComments.Add(reviewComment);
        _dbContext.SaveChanges();

        return CreatedAtAction("GetReviewComment", "ReviewComments", new { id = reviewComment.Id }, reviewComment);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateSubmission(Guid id, Submission updatedSubmission)
    {
        var submission = _dbContext.Submissions.Find(id);

        if (submission == null)
        {
            return NotFound();
        }
        
        submission.Title = updatedSubmission.Title;
        submission.Language = updatedSubmission.Language;
        submission.Code = updatedSubmission.Code;
        submission.Status = updatedSubmission.Status;
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteSubmission(Guid id)
    {
        var submission = _dbContext.Submissions.Find(id);

        if (submission == null)
        {
            return NotFound();
        }
        
        _dbContext.Submissions.Remove(submission);
        _dbContext.SaveChanges();

        return NoContent();
    }
}