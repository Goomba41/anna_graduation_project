namespace backend.Models;

public partial class FIASAddressDetails
{
    public int? postal_code { get; set; } = null!;
    public string? ifns_ul { get; set; } = null!;
    public string? ifns_fl { get; set; } = null!;
    public string? ifns_tul { get; set; } = null!;
    public string? ifns_tfl { get; set; } = null!;
    public string? okato { get; set; } = null!;
    public string? oktmo { get; set; } = null!;
    public string? kladr_code { get; set; } = null!;
    public string? oktmo_budget { get; set; } = null!;
    public string? cadastral_number { get; set; } = null!;
    public string? apart_building { get; set; } = null!;
    public string? remove_cadastr { get; set; } = null!;
    public string? is_adm_capital { get; set; } = null!;
    public string? is_mun_capital { get; set; } = null!;
}

public partial class FIASFederalDistrict
{
    public int id { get; set; }
    public string full_name { get; set; } = "";
    public string short_name { get; set; } = "";
    public int center_id { get; set; }
}

public partial class FIASHierarchyObject
{
    public string object_type { get; set; } = "";
    public int region_code { get; set; }
    public string name { get; set; } = "";
    public string type_name { get; set; } = "";
    public string type_short_name { get; set; } = "";
    public int type_form_code { get; set; }
    public int object_id { get; set; }
    public int object_level_id { get; set; }
    public Guid object_guid { get; set; }
    public string full_name { get; set; } = "";
    public string full_name_short { get; set; } = "";
    public string kladr_code { get; set; } = "";
}

public partial class FIASObject
{
    public int object_id { get; set; }
    public int object_level_id { get; set; }
    public int operation_type_id { get; set; }
    public Guid object_guid { get; set; }
    public int address_type { get; set; }
    public string full_name { get; set; } = "";
    public int region_code { get; set; }
    public bool is_active { get; set; }
    public string path { get; set; } = "";
    public int? successor_ref { get; set; } = null!;
    public FIASFederalDistrict federal_district { get; set; } = new() { };
    public FIASAddressDetails address_details { get; set; } = new() { };
    public List<FIASHierarchyObject> hierarchy { get; set; } = new() { };

    // Путь отличается от id на нижних уровнях
    // public FIASObject()
    // {
    //     path = object_id.ToString();
    // }
}

public partial class FIASObjectWrapper
{
    public List<FIASObject> Addresses { get; set; } = [];
}
