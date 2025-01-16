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
    public class FilesController : ControllerBase
    {
        private readonly IMapper _mapper;

        private readonly AnnaGraduationProjectContext _context;

        private readonly ILogger<AboutController> _logger;

        private readonly IHttpContextAccessor _http;

        public FilesController(IMapper mapper, ILogger<AboutController> logger, AnnaGraduationProjectContext context, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _context = context;
            _http = httpContextAccessor;
            _mapper = mapper;
        }

        [HttpGet("Materials/{material}")]
        public ActionResult GetFilesListByMaterial(int material)
        {
            try
            {
                dynamic responseObject = new ExpandoObject();

                List<FileNonBinaryResponseDTO> queryResult = _context.Files
                  .Where(file => file.MaterialId == material && !file.Deleted)
                  // .Include(file => file.Material)
                  .Select(file => _mapper.Map<FileNonBinaryResponseDTO>(file))
                  .ToList();

                responseObject.result = 0;
                responseObject.rowsQueried = queryResult.Count();
                responseObject.rowsTotal = _context.Files.Count();
                responseObject.data = queryResult;

                return Ok(responseObject);
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }

        }

        // [HttpPost]
        // public async Task<ActionResult<Material>> PostMaterial(Material material)
        // {
        //     var existedLogin = _context.Materials
        //         .FirstOrDefault(u => u.Id.Equals(material.Id) && !u.Deleted);

        //     if (existedLogin != null)
        //     {
        //         _logger.LogError($"Попытка создать материал с существующим идентификатором («{material.Id}»)");
        //         return new JsonResult(new { result = -1, Error = $"Материал с идентификатором «{material.Id}» существует" });
        //     }

        //     _context.Materials.Add(material);
        //     await _context.SaveChangesAsync();

        //     _context.Entry(material).Reference(m => m.DepartureType).Load();
        //     _context.Entry(material).Reference(m => m.DocumentType).Load();
        //     _context.Entry(material).Reference(m => m.Project).Load();
        //     _context.Entry(material).Reference(m => m.Creator).Load();
        //     _context.Entry(material).Reference(m => m.Institution).Load();

        //     return new JsonResult(new
        //     {
        //         result = 0,
        //         createdId = material.Id,
        //         data = _mapper.Map<MaterialResponseDTO>(material)
        //     });
        // }

        // [HttpDelete("{id}")]
        // public IActionResult DeleteMaterial(int id)
        // {
        //     try
        //     {
        //         var material = _context.Materials.Find(id);
        //         if (material == null)
        //         {
        //             return NotFound();
        //         }

        //         material.Deleted = true;
        //         // _context.Materials.Remove(user);
        //         _context.SaveChanges();

        //         return new JsonResult(new { result = 0, deletedId = material.Id });
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError(Utils.GetErrorMessageByException(ex));
        //         return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
        //     }
        // }

        // private bool MaterialExists(int id)
        // {
        //     return _context.Materials.Any(e => e.Id == id);
        // }
    }
}
