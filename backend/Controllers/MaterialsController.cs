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
    [Authorize]
    public class MaterialsController : ControllerBase
    {
        private readonly IMapper _mapper;

        private readonly AnnaGraduationProjectContext _context;

        private readonly ILogger<AboutController> _logger;

        private readonly IHttpContextAccessor _http;

        public MaterialsController(IMapper mapper, ILogger<AboutController> logger, AnnaGraduationProjectContext context, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _context = context;
            _http = httpContextAccessor;
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult GetMaterials([FromQuery] MaterialType? materialType)
        {
            try
            {
                var queryModel = _context.Materials.AsQueryable();

                dynamic responseObject = new ExpandoObject();

                queryModel = queryModel
                    .Where(t => !t.Deleted);

                // Параметры из FromQuery
                if (materialType != null)
                {
                    queryModel = queryModel.Where(t => t.MaterialType == (int)materialType);
                }

                queryModel = queryModel
                    .OrderBy(t => t.Number);
                // .ThenBy(t => t.FirstName)
                // .ThenBy(t => t.Patronymic);

                var queryResult = queryModel
                  .Include(m => m.DepartureType)
                  .Include(m => m.DocumentType)
                  .Include(m => m.Project)
                  .Include(m => m.Creator)
                  .Include(m => m.Institution)
                  .Select(material => _mapper.Map<MaterialResponseDTO>(material))
                  .ToList();

                responseObject.result = 0;
                responseObject.rowsQueried = queryModel.Count();
                responseObject.rowsTotal = _context.Materials.Count();
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
        public async Task<IActionResult> PutMaterial(int id, Material material)
        {

            Material? materialFromContext = _context
              .Materials
              .AsNoTracking()
              .FirstOrDefault(dbm => dbm.Id == material.Id);

            if (materialFromContext != null)
            {
                if (id != material.Id)
                {
                    return BadRequest();
                }

                _context.Entry(material).State = EntityState.Modified;

                _context.Entry(material).Reference(m => m.DepartureType).Load();
                _context.Entry(material).Reference(m => m.DocumentType).Load();
                _context.Entry(material).Reference(m => m.Project).Load();
                _context.Entry(material).Reference(m => m.Creator).Load();
                _context.Entry(material).Reference(m => m.Institution).Load();

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MaterialExists(id))
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
                    updatedId = material.Id,
                    data = _mapper.Map<MaterialResponseDTO>(material)
                });
            }
            else
            {
                return new JsonResult(new
                {
                    result = -1,
                    error = "Материал не существует"
                });
            }

        }

        [HttpPost]
        public async Task<ActionResult<Material>> PostMaterial(Material material)
        {
            var existedLogin = _context.Materials
                .FirstOrDefault(u => u.Id.Equals(material.Id) && !u.Deleted);

            if (existedLogin != null)
            {
                _logger.LogError($"Попытка создать материал с существующим идентификатором («{material.Id}»)");
                return new JsonResult(new { result = -1, Error = $"Материал с идентификатором «{material.Id}» существует" });
            }

            _context.Materials.Add(material);
            await _context.SaveChangesAsync();

            _context.Entry(material).Reference(m => m.DepartureType).Load();
            _context.Entry(material).Reference(m => m.DocumentType).Load();
            _context.Entry(material).Reference(m => m.Project).Load();
            _context.Entry(material).Reference(m => m.Creator).Load();
            _context.Entry(material).Reference(m => m.Institution).Load();

            return new JsonResult(new
            {
                result = 0,
                createdId = material.Id,
                data = _mapper.Map<MaterialResponseDTO>(material)
            });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMaterial(int id)
        {
            try
            {
                var material = _context.Materials.Find(id);
                if (material == null)
                {
                    return NotFound();
                }

                material.Deleted = true;
                // _context.Materials.Remove(user);
                _context.SaveChanges();

                return new JsonResult(new { result = 0, deletedId = material.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }
        }

        private bool MaterialExists(int id)
        {
            return _context.Materials.Any(e => e.Id == id);
        }
    }
}
