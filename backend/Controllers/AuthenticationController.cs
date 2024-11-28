using System.Text;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

using backend.Authorization;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly AnnaGraduationProjectContext _context;

        public IConfiguration _configuration;

        public AuthenticationController(AnnaGraduationProjectContext context, IConfiguration config)
        {
            _context = context;
            _configuration = config;
        }

        [HttpPost("Login")]
        public async Task<ActionResult<User>> Login(LoginRequest form)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(u => !u.Deleted && u.Login == form.Login);

            if (user == null)
            {
                return NotFound();
            }

            if (user.Password != GetPasswordHash(form.Password))
            {
                return BadRequest("Invalid credentials");
            }

            var claims = new[] {
              new Claim(JwtRegisteredClaimNames.Sub, _configuration["Token:subject"]!),
              new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
              new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
              new Claim("UserId", user.Id.ToString()),
              new Claim("UserName", String.Format("{0} {1} {2}", user.LastName, user.FirstName, user.Patronymic)),
              new Claim("UserLogin", user.Login)
            };

            //Create Signing Credentials to sign the token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Token:key"]!));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create the token
            var token = new JwtSecurityToken(
                _configuration["Token:issuer"],
                _configuration["Token:audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(10),
                signingCredentials: signIn);

            // Serialize the token to a string
            var tokenStr = new JwtSecurityTokenHandler().WriteToken(token);

            //Add token string to response object and send it back to requestor
            var authResponse = new LoginResponse(tokenStr);

            return Ok(authResponse);
        }

        private string GetPasswordHash(string password, string salt = "7Q}.3pOWl9pR=FmGVig]")
        {
            string hash = string.Empty;
            foreach (byte b in MD5.HashData(Encoding.Default.GetBytes(password + salt)))
            {
                hash += b.ToString("X2");
            }
            return hash;
        }

    }
}
