using System.Dynamic;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;

using AutoMapper;

using backend.Models;
// using backend.DTOs;

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

                ChartData materialsByType = new();

                materialsByType.Labels = new List<string> { "Входящие", "Исходящие" };
                materialsByType.Datasets.Add(new Dataset()
                {
                    Data = new List<int> {
                      _context.Materials.Count(m => m.MaterialType == (int)MaterialType.Incoming && !m.Deleted),
                      _context.Materials.Count(m => m.MaterialType == (int)MaterialType.Outgoing && !m.Deleted)
                    }
                });

                ChartData materialsByUser = new();

                materialsByUser.Labels = _context.Users
                  .OrderBy(u => u.LastName)
                  .Select(u => $"{u.LastName} {(u.FirstName != null ? u.FirstName.Substring(0, 1) + "." : "")}{(u.Patronymic != null ? u.Patronymic.Substring(0, 1) + "." : "")}".Trim()).ToList();
                materialsByUser.Datasets.Add(new Dataset()
                {
                    Data = _context.Users.OrderBy(u => u.LastName).Select(u => u.Materials.Count(m => !m.Deleted)).ToList()
                });

                List<string> DocumentTypes = _context.DocumentTypes.OrderBy(dt => dt.Name).Select(dt => dt.Name).ToList();
                List<string> Projects = _context.Projects.OrderBy(dt => dt.Name).Select(dt => dt.Name).ToList();

                ChartData incomingByTypes = new();

                incomingByTypes.Labels = DocumentTypes;
                incomingByTypes.Datasets.Add(new Dataset()
                {
                    Data = _context.DocumentTypes
                      .OrderBy(dt => dt.Name)
                      .Select(dt => dt.Materials.Count(m => !m.Deleted && m.MaterialType == 0))
                      .ToList()
                });

                ChartData incomingByProjects = new();

                incomingByProjects.Labels = Projects;
                incomingByProjects.Datasets.Add(new Dataset()
                {
                    Data = _context.Projects
                      .OrderBy(u => u.Name)
                      .Select(u => u.Materials.Count(m => !m.Deleted && m.MaterialType == 0))
                      .ToList()
                });

                ChartData outgoingByTypes = new();

                outgoingByTypes.Labels = DocumentTypes;
                outgoingByTypes.Datasets.Add(new Dataset()
                {
                    Data = _context.DocumentTypes
                      .OrderBy(dt => dt.Name)
                      .Select(dt => dt.Materials.Count(m => !m.Deleted && m.MaterialType == 1))
                      .ToList()
                });

                ChartData outgoingByProjects = new();

                outgoingByProjects.Labels = Projects;
                outgoingByProjects.Datasets.Add(new Dataset()
                {
                    Data = _context.Projects
                      .OrderBy(u => u.Name)
                      .Select(u => u.Materials.Count(m => !m.Deleted && m.MaterialType == 1))
                      .ToList()
                });

                ChartData materialsByMonths = new();

                materialsByMonths.Datasets.Add(new Dataset()
                {
                    Type = "bar",
                    Label = "Входящие",
                    Data = new()
                });

                materialsByMonths.Datasets.Add(new Dataset()
                {
                    Type = "bar",
                    Label = "Исходящие",
                    Data = new()
                });

                ChartData institutionsByMonths = new();

                institutionsByMonths.Datasets.Add(new Dataset()
                {
                    Type = "bar",
                    Label = "Учреждений",
                    Data = new()
                });

                DateTime nowMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                int numberOfMonths = 7;

                List<string> monthsLabels = new();

                for (int i = numberOfMonths - 1; i >= 0; i--)
                {
                    int currentMonth = nowMonth.Month - i;
                    int currentYear = nowMonth.Year;
                    if (currentMonth <= 0)
                    {
                        currentYear -= 1;
                        currentMonth = 12 + currentMonth;
                    }

                    DateTime startOfMonth = new DateTime(currentYear, currentMonth, 1);
                    DateTime endOfMonth = new DateTime(currentYear, currentMonth, DateTime.DaysInMonth(currentYear, currentMonth));

                    string fullMonthName = startOfMonth.ToString("MMMM", CultureInfo.CreateSpecificCulture("ru"));

                    monthsLabels.Add($"{char.ToUpper(fullMonthName[0]) + fullMonthName.Substring(1)} • {currentYear.ToString()}");

                    materialsByMonths.Datasets[0].Data.Add(
                      _context.Materials.Count(m => m.ActionDate.ToLocalTime() <= endOfMonth.ToLocalTime() && m.ActionDate.ToLocalTime() >= startOfMonth.ToLocalTime() && m.MaterialType == 0 && !m.Deleted)
                    );
                    materialsByMonths.Datasets[1].Data.Add(
                    _context.Materials.Count(m => m.ActionDate.ToLocalTime() <= endOfMonth.ToLocalTime() && m.ActionDate.ToLocalTime() >= startOfMonth.ToLocalTime() && m.MaterialType == 1 && !m.Deleted)
                    );

                    institutionsByMonths.Datasets[0].Data.Add(
                      _context.Institutions.Count(m => m.CreationDateTime.ToLocalTime() <= endOfMonth.ToLocalTime() && m.CreationDateTime.ToLocalTime() >= startOfMonth.ToLocalTime() && !m.Deleted)
                    );
                }

                materialsByMonths.Labels = monthsLabels;
                institutionsByMonths.Labels = monthsLabels;

                responseObject.result = 0;
                responseObject.data = new
                {
                    materialsByType,
                    materialsByUser,
                    incomingByTypes,
                    incomingByProjects,
                    outgoingByTypes,
                    outgoingByProjects,
                    materialsByMonths,
                    institutionsByMonths
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
