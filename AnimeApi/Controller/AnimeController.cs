using AnimeApi.Data;
using AnimeApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AnimeApi.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnimeController : ControllerBase
    {
        private readonly AnimeDbContext _context;
        private readonly ILogger<AnimeController> _logger;

        public AnimeController(AnimeDbContext context, ILogger<AnimeController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Anime>>> GetAnimes()
        {
            try
            {
                _logger.LogInformation("Fetching anime list.");
                var animes = await _context.Animes.ToListAsync();
                return Ok(animes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching anime list.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Anime>> GetAnime(int id)
        {
            try
            {
                var anime = await _context.Animes.FindAsync(id);
                if (anime == null)
                {
                    return NotFound();
                }

                return Ok(anime);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching anime with ID {id}.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Anime>> PostAnime(Anime anime)
        {
            try
            {
                _context.Animes.Add(anime);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAnime), new { id = anime.Id }, anime);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding new anime.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnime(int id, Anime anime)
        {
            if (id != anime.Id)
            {
                return BadRequest("Anime ID mismatch.");
            }

            _context.Entry(anime).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AnimeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    _logger.LogError($"Concurrency error updating anime with ID {id}.");
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating anime with ID {id}.");
                return StatusCode(500, "Internal server error");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnime(int id)
        {
            try
            {
                var anime = await _context.Animes.FindAsync(id);
                if (anime == null)
                {
                    return NotFound();
                }

                _context.Animes.Remove(anime);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting anime with ID {id}.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("{animeId}/watch-later")]
        public async Task<IActionResult> AddToWatchLater(int animeId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                {
                    return Unauthorized("User ID not found.");
                }

                if (!int.TryParse(userId, out var parsedUserId))
                {
                    return Unauthorized("Invalid user ID format.");
                }

                var user = await _context.Users
                    .Include(u => u.WatchLater)
                    .FirstOrDefaultAsync(u => u.Id == parsedUserId);

                if (user == null)
                {
                    return Unauthorized("User not found.");
                }

                var anime = await _context.Animes.FindAsync(animeId);
                if (anime == null)
                {
                    return NotFound("Anime not found.");
                }

                if (user.WatchLater.Contains(anime))
                {
                    return BadRequest("Anime already in watch later list.");
                }

                user.WatchLater.Add(anime);
                await _context.SaveChangesAsync();

                return Ok("Anime added to Watch Later list");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding anime to watch later.");
                return StatusCode(500, "Internal server error");
            }
        }

        private bool AnimeExists(int id)
        {
            return _context.Animes.Any(e => e.Id == id);
        }
    }
}
