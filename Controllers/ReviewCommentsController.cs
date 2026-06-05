using Microsoft.AspNetCore.Mvc;
using Rubberduck.Api;

namespace Rubberduck.Controllers;

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
}