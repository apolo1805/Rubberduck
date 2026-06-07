using Microsoft.AspNetCore.Mvc;
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
        _dbContext.Submissions.Add(submission);
        _dbContext.SaveChanges();
        return CreatedAtAction(nameof(GetSubmissions), new { id = submission.Id }, submission);
    }

    [HttpGet("{id}")]
    public IActionResult GetSubmission(Guid id)
    {
        var submission = _dbContext.Submissions.Find(id);

        if (submission == null)
        {
            return NotFound();
        }
        return Ok(submission);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateSubmissions(Guid id, Submission updatedSubmission)
    {
        var submission = _dbContext.Submissions.Find(id);

        if (submission == null)
        {
            return NotFound();
        }
        
        submission.Title = updatedSubmission.Title;
        submission.Language = updatedSubmission.Language;
        submission.Code = updatedSubmission.Code;
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