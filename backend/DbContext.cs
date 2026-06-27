using Microsoft.EntityFrameworkCore;

namespace Rubberduck.Api;

public class DbContextApp : DbContext
{
    public DbContextApp(DbContextOptions<DbContextApp> options) : base(options)
    {
        
    }

    public DbSet<Models.Submission> Submissions { get; set; }
    public DbSet<Models.ReviewComment> ReviewComments { get; set; }
}