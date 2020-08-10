using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Decsys.Auth
{
    // TODO: this can go when we switch to mongo <3
    public class MemoryDbContext : IdentityDbContext<IdentityUser>
    {
        public MemoryDbContext(DbContextOptions<MemoryDbContext> options)
            : base(options) { }
    }
}
