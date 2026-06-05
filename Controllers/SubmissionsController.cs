using Microsoft.AspNetCore.Mvc;
using Rubberduck.Api;

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
}