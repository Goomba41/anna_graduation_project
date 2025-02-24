using System.Dynamic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

using AutoMapper;

using backend.Models;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize]
    public class InstitutionsController : ControllerBase
    {
        private readonly IMapper _mapper;

        private readonly AnnaGraduationProjectContext _context;

        private readonly ILogger<AboutController> _logger;

        private readonly IHttpContextAccessor _http;

        public InstitutionsController(IMapper mapper, ILogger<AboutController> logger, AnnaGraduationProjectContext context, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _context = context;
            _http = httpContextAccessor;
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult GetInstitutions()
        {
            try
            {
                var queryModel = _context.Institutions.AsQueryable();

                dynamic responseObject = new ExpandoObject();

                queryModel = queryModel
                    .Where(t => !t.Deleted);

                // Параметры из FromQuery
                // if (node != null)
                // {
                //     queryModel = queryModel.Where(t => t.Node == node);
                // }

                queryModel = queryModel
                    .OrderBy(t => t.Name);
                // .ThenBy(t => t.FirstName)
                // .ThenBy(t => t.Patronymic);

                var queryResult = queryModel
                .Select(institution => _mapper.Map<InstitutionResponseDTO>(institution))
                .ToList();

                responseObject.result = 0;
                responseObject.rowsQueried = queryModel.Count();
                responseObject.rowsTotal = _context.Institutions.Count();
                responseObject.data = queryResult;

                return Ok(responseObject);
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }
        }

        [HttpGet]
        [Route("{id}/Materials")]
        public ActionResult GetInstitutionMaterials(int id)
        {
            try
            {
                if (!InstitutionExists(id))
                {
                    return NotFound();
                }

                dynamic responseObject = new ExpandoObject();

                // queryModel = queryModel
                //     .Where(t => !t.Deleted);

                // Параметры из FromQuery
                // if (node != null)
                // {
                //     queryModel = queryModel.Where(t => t.Node == node);
                // }

                // queryModel = queryModel
                //     .OrderBy(t => t.Name);
                // .ThenBy(t => t.FirstName)
                // .ThenBy(t => t.Patronymic);

                var queryResult = _context.Materials
                  .Include(m => m.DepartureType)
                  .Include(m => m.DocumentType)
                  .Include(m => m.Project)
                  .Include(m => m.Creator)
                  .Include(m => m.Institution)
                  .Where(i => i.InstitutionId == id && i.Institution != null && i.Institution.Id == id && !i.Deleted)
                  .Select(material => _mapper.Map<MaterialResponseDTO>(material))
                  .ToList();

                responseObject.result = 0;
                responseObject.rowsQueried = queryResult.Count();
                responseObject.rowsTotal = queryResult.Count();
                responseObject.data = queryResult;

                return Ok(responseObject);
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutInstitution(int id, Institution institution)
        {

            Institution? userFromContext = _context.Institutions.AsNoTracking().FirstOrDefault(dbu => dbu.Id == institution.Id);

            if (userFromContext != null)
            {
                if (id != institution.Id)
                {
                    return BadRequest();
                }

                _context.Entry(institution).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!InstitutionExists(id))
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
                    updatedId = institution.Id,
                    data = _mapper.Map<InstitutionResponseDTO>(institution)
                });
            }
            else
            {
                return new JsonResult(new
                {
                    result = -1,
                    error = "Учреждение не существует"
                });
            }

        }

        [HttpPost]
        public async Task<ActionResult<Institution>> PostInstitution(Institution institution)
        {
            var existedLogin = _context.Institutions
                .FirstOrDefault(u => u.Id.Equals(institution.Id) && !u.Deleted);

            if (existedLogin != null)
            {
                _logger.LogError($"Попытка создать учреждение с существующим идентификатором («{institution.Id}»)");
                return new JsonResult(new { result = -1, Error = $"Учреждение с идентификатором «{institution.Id}» существует" });
            }

            // institution.CreationDateTime = DateTime.SpecifyKind(institution.CreationDateTime, DateTimeKind.Utc);
            _context.Institutions.Add(institution);
            await _context.SaveChangesAsync();

            return new JsonResult(new
            {
                result = 0,
                createdId = institution.Id,
                data = _mapper.Map<InstitutionResponseDTO>(institution)
            });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteInstitution(int id)
        {
            try
            {
                var institution = _context.Institutions.Find(id);
                if (institution == null)
                {
                    return NotFound();
                }

                institution.Deleted = true;
                // _context.Institutions.Remove(user);
                _context.SaveChanges();

                return new JsonResult(new { result = 0, deletedId = institution.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }
        }

        private bool InstitutionExists(int id)
        {
            return _context.Institutions.Any(e => e.Id == id);
        }
    }
}
