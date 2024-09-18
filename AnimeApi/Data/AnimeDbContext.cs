using AnimeApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AnimeApi.Data
{
	public class AnimeDbContext : DbContext
	{
		public AnimeDbContext(DbContextOptions<AnimeDbContext> options) : base(options)
		{
		}
		public DbSet<Anime> Animes { get; set; }
		public DbSet<User> Users { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
		}

	}
}
