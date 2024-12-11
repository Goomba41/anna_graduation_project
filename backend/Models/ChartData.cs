namespace backend.Models;

public class Dataset
{
    // type: "bar",
    // label: "Входящие",

    public string? Label { get; set; }

    public string? Type { get; set; }

    public List<int> Data { get; set; } = new List<int> { };
}

public partial class ChartData
{
    public List<string> Labels { get; set; } = new List<string> { };

    public List<Dataset> Datasets { get; set; } = new List<Dataset> { };
}
