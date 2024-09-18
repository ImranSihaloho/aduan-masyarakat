namespace AnimeApi.Models
{
	public class Anime
	{
		public int Id { get; set; }
		public string Title { get; set; }
		public string Description { get; set; }
		public string Category { get; set; }
		public string VideoUrl { get; set; }
		public string ThumbnailUrl { get; set; }
		public DateTime ReleaseDate { get; set; }
		public ICollection<User> Users { get; set; } = new List<User>();
	}

}
