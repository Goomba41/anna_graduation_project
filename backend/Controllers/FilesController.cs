using System.Dynamic;

using Microsoft.AspNetCore.Mvc;

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

        [HttpGet("{id}/blob")]
        public ActionResult GetFileBlob(int id)
        {
            try
            {
                IQueryable<Models.File> query = _context.Files
                  .Where(file => file.Id == id && !file.Deleted);

                FileBinaryResponseDTO? queryResult = query
                  // .Include(file => file.Material)
                  .Select(file => _mapper.Map<FileBinaryResponseDTO>(file))
                  .FirstOrDefault();

                if (queryResult != null)
                {
                    query.FirstOrDefault()!.Atime = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                    _context.SaveChanges();

                    return Ok(queryResult);
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }

        }

        [HttpPost("materials/{materialId}")]
        public async Task<ActionResult<FileNonBinaryResponseDTO>> PostFileToMaterial(int materialId, [FromForm] FileNonBinaryResponseDTO form)
        {
            if (!Request.HasFormContentType)
            {
                return BadRequest("Unsupported media type");
            }

            var material = _context.Materials
              .Where(material => material.Id == materialId)
              .FirstOrDefault();

            if (material == null)
            {
                _logger.LogError($"Попытка создать файл к несуществующему материалу с идентификатором («{materialId}»)");
                return new JsonResult(new { result = -1, Error = $"Материал с идентификатором «{materialId}» не существует" });
            }

            Models.File mappedForm = _mapper.Map<Models.File>(form);

            IFormCollection? rawForm = await Request.ReadFormAsync();

            foreach (IFormFile file in rawForm.Files)
            {
                byte[] bytes = new byte[file.Length];
                await file.OpenReadStream().ReadAsync(bytes, 0, (int)file.Length);
                mappedForm.Binary = bytes;
            }

            mappedForm.Material = material;
            _context.Files.Add(mappedForm);

            await _context.SaveChangesAsync();

            return new JsonResult(new
            {
                result = 0,
                createdId = mappedForm.Id,
                data = _mapper.Map<FileNonBinaryResponseDTO>(mappedForm)
            });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteFile(int id)
        {
            try
            {
                var file = _context.Files.Find(id);
                if (file == null)
                {
                    return NotFound();
                }

                file.Deleted = true;
                // _context.Files.Remove(file);
                _context.SaveChanges();

                return new JsonResult(new { result = 0, deletedId = file.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }
        }

        // private bool MaterialExists(int id)
        // {
        //     return _context.Materials.Any(e => e.Id == id);
        // }
    }
}
