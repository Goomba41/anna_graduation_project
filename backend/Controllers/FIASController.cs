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
    public class FIASController : ControllerBase
    {
        private readonly IMapper _mapper;

        public IConfiguration _configuration;

        public FIASController(IConfiguration config, IMapper mapper)
        {
            _configuration = config;
            _mapper = mapper;
        }

        [HttpGet("Subjects")]
        public async Task<ActionResult> GetSubjects()
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Master-Token", _configuration.GetSection("FIASMasterToken").Value);
            HttpResponseMessage response = await client.PostAsJsonAsync(_configuration.GetSection("FIASAddressItemsURL").Value, new
            {
                address_level = 1
            });

            if (response.IsSuccessStatusCode)
            {
                List<FIASObject>? addresses = JsonConvert.DeserializeObject<FIASObjectWrapper>(await response.Content.ReadAsStringAsync())?.Addresses;
                return new JsonResult(new
                {
                    result = 0,
                    addresses = _mapper.Map<List<FIASObject>, List<FIASObjectDTO>>(
                      addresses ?? new List<FIASObject>()
                    ).OrderBy(a => a.RegionCode)
                });
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("Subjects/{subjectId}/Districts")]
        public async Task<ActionResult> GetDistricts([FromRoute] int subjectId)
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Master-Token", _configuration.GetSection("FIASMasterToken").Value);
            HttpResponseMessage response = await client.PostAsJsonAsync(_configuration.GetSection("FIASAddressItemsURL").Value, new
            {
                address_levels = new[] { 3 },
                address_type = 2,
                path = subjectId.ToString()
            });

            // return Ok(response);

            if (response.IsSuccessStatusCode)
            {
                List<FIASObject>? addresses = JsonConvert.DeserializeObject<FIASObjectWrapper>(await response.Content.ReadAsStringAsync())?.Addresses;
                return new JsonResult(new
                {
                    result = 0,
                    addresses = _mapper.Map<List<FIASObject>, List<FIASObjectDTO>>(
                      addresses ?? new List<FIASObject>()
                    ).OrderBy(a => a.FullName)
                });
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("Subjects/{subjectId}/Districts/{disctrictId}/Localities")]
        public async Task<ActionResult> GetLocalities([FromRoute] int subjectId, int disctrictId)
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Master-Token", _configuration.GetSection("FIASMasterToken").Value);
            HttpResponseMessage response = await client.PostAsJsonAsync(_configuration.GetSection("FIASAddressItemsURL").Value, new
            {
                address_levels = new[] { 2, 5, 6, 4 },
                address_type = 2,
                path = String.Format("{0}.{1}", subjectId, disctrictId)
            });

            // return Ok(response);

            if (response.IsSuccessStatusCode)
            {
                List<FIASObject>? addresses = JsonConvert.DeserializeObject<FIASObjectWrapper>(await response.Content.ReadAsStringAsync())?.Addresses;
                return new JsonResult(new
                {
                    result = 0,
                    addresses = _mapper.Map<List<FIASObject>, List<FIASObjectDTO>>(
                      addresses ?? new List<FIASObject>()
                    ).OrderBy(a => a.FullName)
                });
            }

            return BadRequest();
        }
    }
}
