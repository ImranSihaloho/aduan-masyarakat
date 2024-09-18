using AnimeApi.Data;
using AnimeApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace AnimeApi.Controller
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly AnimeDbContext _context;
		private readonly IConfiguration _configuration;

		public AuthController(AnimeDbContext context, IConfiguration configuration)
		{
			_context = context;
			_configuration = configuration;
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] UserRegisterDto userRegisterDto)
		{
			var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Username == userRegisterDto.Username);
			if (existingUser != null)
			{
				return BadRequest("User already exists.");
			}

			if (userRegisterDto.Role == "Admin")
			{
				var adminCount = await _context.Users.CountAsync(u => u.Role == "Admin");
				if (adminCount >= 2)
				{
					return BadRequest("Cannot create more than 2 admins.");
				}
			}

			var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userRegisterDto.Password);
			var user = new User
			{
				Username = userRegisterDto.Username,
				PasswordHash = BCrypt.Net.BCrypt.HashPassword(userRegisterDto.Password),
				Role = "user"
			};

			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			return Ok(new { Message = "User registered successfully." });
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
		{
			if (userLoginDto == null)
			{
				return BadRequest("userLoginDto field is required.");
			}

			// Log incoming request
			Console.WriteLine($"Login attempt: Username={userLoginDto.Username}");

			var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == userLoginDto.Username);

			if (user == null || !BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.PasswordHash))
			{
				return Unauthorized("Invalid credentials");
			}

			var token = GenerateJwtToken(user);
			return Ok(new { Token = token, Role = user.Role });
		}



		private string GenerateJwtToken(User user)
		{
			var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
			var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

			var claims = new[]
			{
			new Claim(JwtRegisteredClaimNames.Sub, user.Username),
			new Claim("role", user.Role)
		};

			var token = new JwtSecurityToken(
				issuer: _configuration["Jwt:Issuer"],
				audience: _configuration["Jwt:Audience"],
				claims: claims,
				expires: DateTime.Now.AddDays(1),
				signingCredentials: credentials);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}

	public class UserLoginDto
	{
		public string Username { get; set; }
		public string Password { get; set; }
	}

	public class UserRegisterDto
	{
		public string Username { get; set; }
		public string Password { get; set; }
		public string Role { get; set; }
	}


}
