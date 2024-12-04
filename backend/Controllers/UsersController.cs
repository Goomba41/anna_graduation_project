using System.Dynamic;
using System.Globalization;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

using AutoMapper;
using DevExtreme;
using DevExtreme.AspNet.Data;

using backend.Models;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IMapper _mapper;

        private readonly AnnaGraduationProjectContext _context;

        private readonly ILogger<AboutController> _logger;

        private readonly IHttpContextAccessor _http;

        public UsersController(IMapper mapper, ILogger<AboutController> logger, AnnaGraduationProjectContext context, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _context = context;
            _http = httpContextAccessor;
            _mapper = mapper;
        }

        // GET: api/Users
        [HttpGet]
        public ActionResult GetUsers()
        {
            try
            {
                var queryModel = _context.Users.AsQueryable();

                dynamic responseObject = new ExpandoObject();

                queryModel = queryModel
                    .Where(t => !t.Deleted);

                // Параметры из FromQuery
                // if (node != null)
                // {
                //     queryModel = queryModel.Where(t => t.Node == node);
                // }

                queryModel = queryModel
                    .OrderBy(t => t.LastName)
                    .ThenBy(t => t.FirstName)
                    .ThenBy(t => t.Patronymic);

                var queryResult = queryModel
                .Select(user => _mapper.Map<UserResponseDTO>(user))
                .ToList();

                responseObject.result = 0;
                responseObject.rowsQueried = queryModel.Count();
                responseObject.rowsTotal = _context.Users.Count();
                responseObject.data = queryResult;

                return Ok(responseObject);
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }

        }

        // GET: api/Users/5
        // [HttpGet("{id}")]
        // public async Task<ActionResult<User>> GetUser(int id)
        // {
        //     var user = await _context.Users.FindAsync(id);

        //     if (user == null)
        //     {
        //         return NotFound();
        //     }

        //     return user;
        // }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {

            User? userFromContext = _context.Users.AsNoTracking().FirstOrDefault(dbu => dbu.Id == user.Id);

            if (userFromContext != null)
            {
                if (!string.IsNullOrEmpty(user.Password))
                {
                    user.Password = Utils.GetPasswordHash(user.Password);
                }
                else
                {
                    // Иначе пароль заменяется на null, потому что не отправляется с фронта
                    user.Password = userFromContext.Password;
                }

                var existedLogin = _context.Users
                    .FirstOrDefault(u => u.Login.ToLower().Equals(user.Login.ToLower()) && !u.Deleted && u.Id != user.Id);

                if (existedLogin != null)
                {
                    _logger.LogError($"Попытка создать пользователя с существующим логином («{user.Login}»)");
                    return new JsonResult(new { result = -1, Error = $"Пользователь с логином «{user.Login}» существует" });
                }

                if (id != user.Id)
                {
                    return BadRequest();
                }

                _context.Entry(user).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return new JsonResult(new
                {
                    result = 0,
                    updatedId = user.Id,
                    data = _mapper.Map<UserResponseDTO>(user)
                });
            }
            else
            {
                return new JsonResult(new
                {
                    result = -1,
                    error = "Пользователь не существует"
                });
            }

        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            user.Password = Utils.GetPasswordHash(user.Password!);

            var existedLogin = _context.Users
                .FirstOrDefault(u => u.Login.ToLower().Equals(user.Login.ToLower()) && !u.Deleted);

            if (existedLogin != null)
            {
                _logger.LogError($"Попытка создать пользователя с существующим логином («{user.Login}»)");
                return new JsonResult(new { result = -1, Error = $"Пользователь с логином «{user.Login}» существует" });
            }

            var numberOfSysadmins = _context.Users.Where(u => u.Sysadmin).Count();

            if (numberOfSysadmins < 1)
            {
                user.Sysadmin = true;
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new JsonResult(new
            {
                result = 0,
                createdId = user.Id,
                data = _mapper.Map<UserResponseDTO>(user)
            });
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                {
                    return NotFound();
                }

                user.Deleted = true;
                // _context.Users.Remove(user);
                _context.SaveChanges();

                return new JsonResult(new { result = 0, deletedId = user.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        // POST: api/Users/activity
        [HttpPost("activity")]
        public ActionResult PostUserActivity(UsersActivity activity)
        {
            try
            {
                activity.Userid = int.Parse(_http.HttpContext?.User.FindFirst("UserId")?.Value ?? "0");
                Utils.WriteActionToLog(activity, _context);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }
        }

        [HttpGet("activity")]
        public IActionResult GetUsersActivity([FromQuery] DataSourceLoadOptions loadOptions)
        {
            try
            {
                loadOptions.PrimaryKey = new[] { "id" };

                var queryResult = _context.UsersActivities.AsQueryable()
                    .Select(s => new
                    {
                        id = s.Id,
                        userid = s.Userid,
                        userfullname = String.Format("{0} {1} {2}", s.User!.LastName, s.User.FirstName, s.User.Patronymic) + '@' + s.User.Login,
                        action = s.Action,
                        actiondate = string.Concat(s.Actiondate!.Value.ToString("o", CultureInfo.InvariantCulture), "Z"),
                    }).ToList();

                return new JsonResult(DataSourceLoader.Load(queryResult, loadOptions));
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }
        }

    }
}
