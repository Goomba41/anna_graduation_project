using System.Dynamic;
using Microsoft.AspNetCore.Mvc;

using AutoMapper;

using backend.Models;
using backend.DTOs;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]
    public class AnalitycsController : ControllerBase
    {
        private readonly IMapper _mapper;

        public IConfiguration _configuration;

        private readonly ILogger<AboutController> _logger;

        private readonly AnnaGraduationProjectContext _context;

        public AnalitycsController(IConfiguration config, IMapper mapper, AnnaGraduationProjectContext context, ILogger<AboutController> logger)
        {
            _configuration = config;
            _mapper = mapper;
            _context = context;
            _logger = logger;
        }

        [HttpGet("Materials/Doughnuts")]
        public ActionResult GetProjects()
        {
            try
            {

                dynamic responseObject = new ExpandoObject();

                dynamic analyticData = new ExpandoObject();

                DoughnutData materialsByType = new();

                materialsByType.Labels = new List<string> { "Входящие", "Исходящие" };
                materialsByType.Datasets.Add(new Dataset()
                {
                    Data = new List<int> {
                      _context.Materials.Count(m => m.MaterialType == (int)MaterialType.Incoming && !m.Deleted),
                      _context.Materials.Count(m => m.MaterialType == (int)MaterialType.Outgoing && !m.Deleted)
                    }
                });

                DoughnutData materialsByUser = new();

                materialsByUser.Labels = _context.Users
                  .OrderBy(u => u.LastName)
                  .Select(u => $"{u.LastName} {(u.FirstName != null ? u.FirstName.Substring(0, 1) + "." : "")}{(u.Patronymic != null ? u.Patronymic.Substring(0, 1) + "." : "")}".Trim()).ToList();
                materialsByUser.Datasets.Add(new Dataset()
                {
                    Data = _context.Users.OrderBy(u => u.LastName).Select(u => u.Materials.Count(m => !m.Deleted)).ToList()
                });

                List<string> DocumentTypes = _context.DocumentTypes.OrderBy(dt => dt.Name).Select(dt => dt.Name).ToList();
                List<string> Projects = _context.Projects.OrderBy(dt => dt.Name).Select(dt => dt.Name).ToList();

                DoughnutData incomingByTypes = new();

                incomingByTypes.Labels = DocumentTypes;
                incomingByTypes.Datasets.Add(new Dataset()
                {
                    Data = _context.DocumentTypes
                      .OrderBy(dt => dt.Name)
                      .Select(dt => dt.Materials.Count(m => !m.Deleted && m.MaterialType == 0))
                      .ToList()
                });

                DoughnutData incomingByProjects = new();

                incomingByProjects.Labels = Projects;
                incomingByProjects.Datasets.Add(new Dataset()
                {
                    Data = _context.Projects
                      .OrderBy(u => u.Name)
                      .Select(u => u.Materials.Count(m => !m.Deleted && m.MaterialType == 0))
                      .ToList()
                });

                DoughnutData outgoingByTypes = new();

                outgoingByTypes.Labels = DocumentTypes;
                outgoingByTypes.Datasets.Add(new Dataset()
                {
                    Data = _context.DocumentTypes
                      .OrderBy(dt => dt.Name)
                      .Select(dt => dt.Materials.Count(m => !m.Deleted && m.MaterialType == 1))
                      .ToList()
                });

                DoughnutData outgoingByProjects = new();

                outgoingByProjects.Labels = Projects;
                outgoingByProjects.Datasets.Add(new Dataset()
                {
                    Data = _context.Projects
                      .OrderBy(u => u.Name)
                      .Select(u => u.Materials.Count(m => !m.Deleted && m.MaterialType == 1))
                      .ToList()
                });


                responseObject.result = 0;
                responseObject.data = new
                {
                    materialsByType,
                    materialsByUser,
                    incomingByTypes,
                    incomingByProjects,
                    outgoingByTypes,
                    outgoingByProjects
                };

                return Ok(responseObject);
            }
            catch (Exception ex)
            {
                _logger.LogError(Utils.GetErrorMessageByException(ex));
                return new JsonResult(new { result = -1, Error = Utils.GetErrorMessageByException(ex) });
            }
        }
    }
}
