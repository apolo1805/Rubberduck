using Microsoft.AspNetCore.Mvc;
using Rubberduck.Api.Models;

namespace Rubberduck.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReviewCommentsController : ControllerBase
{
    private readonly DbContextApp _dbContext;

    public ReviewCommentsController(DbContextApp dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public IActionResult GetReviewComments()
    {
        var reviewComments = _dbContext.ReviewComments.ToList();

        return Ok(reviewComments);
    }

    [HttpPost]
    public IActionResult CreateReviewComment(ReviewComment reviewComment)
    {
        _dbContext.ReviewComments.Add(reviewComment);
        _dbContext.SaveChanges();

        return CreatedAtAction(nameof(GetReviewComments), new { id = reviewComment.Id }, reviewComment);
    }

    [HttpGet("{id}")]
    public IActionResult GetReviewComment(Guid id)
    {
        var reviewComment = _dbContext.ReviewComments.Find(id);

        if (reviewComment == null)
        {
            return NotFound();
        }
        
        return Ok(reviewComment);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateReviewComment(Guid id, ReviewComment updatedReviewComment)
    {
        var reviewComment = _dbContext.ReviewComments.Find(id);

        if (reviewComment == null)
        {
            return NotFound();
        }
        
        reviewComment.SubmissionId = updatedReviewComment.SubmissionId;
        reviewComment.Content = updatedReviewComment.Content;
        reviewComment.LineNumber = updatedReviewComment.LineNumber;
        reviewComment.Severity = updatedReviewComment.Severity;
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteReivewComment(Guid id)
    {
        var reviewComment = _dbContext.ReviewComments.Find(id);

        if (reviewComment == null)
        {
            return NotFound();
        }
        
        _dbContext.ReviewComments.Remove(reviewComment);
        _dbContext.SaveChanges();

        return NoContent();
    }
}