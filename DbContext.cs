using Microsoft.EntityFrameworkCore;

namespace Rubberduck.Api;

public class DbContextApp : DbContext
{
    public DbContextApp(DbContextOptions<DbContextApp> options) : base(options)
    {
    }
}