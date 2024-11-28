using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/")]
    [ApiController]
    public class AboutController : ControllerBase
    {
        private readonly ILogger<AboutController> _logger;

        public IConfiguration _configuration;

        public AboutController(ILogger<AboutController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpGet]
        [Route("Versions")]
        public async Task<JsonResult> versionsGet()
        {
            try
            {
                using (NpgsqlConnection conn = new NpgsqlConnection(_configuration["DatabaseConnectionString"]!))
                {

                    conn.Open();
                    await using var cmd = new NpgsqlCommand("select version()", conn);
                    await using var reader = await cmd.ExecuteReaderAsync();

                    string PGVersion = String.Empty;
                    while (await reader.ReadAsync())
                    {
                        PGVersion = reader.GetString(0);
                    }
                    _ = conn.CloseAsync();
                    return new JsonResult(
                        new
                        {
                            result = 0,
                            Info = new
                            {
                                DotNetVersion = Environment.Version,
                                OSVersion = Environment.OSVersion,
                                PGVersion = PGVersion
                            }
                        }
                    );
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }
        }
    }
}
