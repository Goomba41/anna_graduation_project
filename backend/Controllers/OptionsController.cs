using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

using AutoMapper;

using backend.Models;
using backend.DTOs;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]
    public class OptionsController : ControllerBase
    {
        private readonly IMapper _mapper;

        public IConfiguration _configuration;

        private readonly ILogger<AboutController> _logger;

        private readonly AnnaGraduationProjectContext _context;

        public OptionsController(IConfiguration config, IMapper mapper, AnnaGraduationProjectContext context, ILogger<AboutController> logger)
        {
            _configuration = config;
            _mapper = mapper;
            _context = context;
            _logger = logger;
        }

        [HttpGet("Projects")]
        public ActionResult GetProjects()
        {
            try
            {
                var queryModel = _context.Projects.AsQueryable();

                queryModel = queryModel
                    .Where(t => !t.Deleted);

                // Параметры из FromQuery
                // if (node != null)
                // {
                //     queryModel = queryModel.Where(t => t.Node == node);
                // }

                queryModel = queryModel
                    .OrderBy(t => t.Name);

                var queryResult = queryModel
                .Select(item => _mapper.Map<StaticHandbookDTO>(item))
                .ToList();

                // responseObject.result = 0;
                // responseObject.rowsQueried = queryModel.Count();
                // responseObject.rowsTotal = _context.Users.Count();
                // responseObject.data = queryResult;

                return Ok(queryResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }
        }

        [HttpGet]
        [Route("Document-Types")]
        public ActionResult GetDocumentTypes()
        {
            try
            {
                var queryModel = _context.DocumentTypes.AsQueryable();

                queryModel = queryModel
                    .Where(t => !t.Deleted);

                // Параметры из FromQuery
                // if (node != null)
                // {
                //     queryModel = queryModel.Where(t => t.Node == node);
                // }

                queryModel = queryModel
                    .OrderBy(t => t.Name);

                var queryResult = queryModel
                .Select(item => _mapper.Map<StaticHandbookDTO>(item))
                .ToList();

                // responseObject.result = 0;
                // responseObject.rowsQueried = queryModel.Count();
                // responseObject.rowsTotal = _context.Users.Count();
                // responseObject.data = queryResult;

                return Ok(queryResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }
        }

        [HttpGet]
        [Route("Departure-Types")]
        public ActionResult GetDepartureTypes()
        {
            try
            {
                var queryModel = _context.DepartureTypes.AsQueryable();

                queryModel = queryModel
                    .Where(t => !t.Deleted);

                // Параметры из FromQuery
                // if (node != null)
                // {
                //     queryModel = queryModel.Where(t => t.Node == node);
                // }

                queryModel = queryModel
                    .OrderBy(t => t.Name);

                var queryResult = queryModel
                .Select(item => _mapper.Map<StaticHandbookDTO>(item))
                .ToList();

                // responseObject.result = 0;
                // responseObject.rowsQueried = queryModel.Count();
                // responseObject.rowsTotal = _context.Users.Count();
                // responseObject.data = queryResult;

                return Ok(queryResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }
        }

        [HttpGet]
        [Route("Institutions")]
        public ActionResult GetInstitutions()
        {
            try
            {
                var queryModel = _context.Institutions.AsQueryable();

                queryModel = queryModel
                    .Where(t => !t.Deleted);

                // Параметры из FromQuery
                // if (node != null)
                // {
                //     queryModel = queryModel.Where(t => t.Node == node);
                // }

                queryModel = queryModel
                    .OrderBy(t => t.Name);

                var queryResult = queryModel
                .Select(item => _mapper.Map<StaticHandbookDTO>(item))
                .ToList();

                // responseObject.result = 0;
                // responseObject.rowsQueried = queryModel.Count();
                // responseObject.rowsTotal = _context.Users.Count();
                // responseObject.data = queryResult;

                return Ok(queryResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }
        }
    }
}
