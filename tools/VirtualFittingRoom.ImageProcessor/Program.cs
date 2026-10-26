using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using VirtualFittingRoom.Application.DependencyInjection;
using VirtualFittingRoom.Application.Services.ImageProcessing;

// Usage: dotnet run --project tools/VirtualFittingRoom.ImageProcessor -- [inputDirectory] [outputDirectory]
var inputDirectory = args.Length > 0 ? args[0] : Path.Combine(AppContext.BaseDirectory, "SampleImages");
var outputDirectory = args.Length > 1 ? args[1] : Path.Combine(Directory.GetCurrentDirectory(), "ProcessedImages");
string[] supportedExtensions = [".png", ".jpg", ".jpeg", ".webp"];

if (!Directory.Exists(inputDirectory))
{
    Console.Error.WriteLine($"Input directory not found: {inputDirectory}");
    return 1;
}

var inputFiles = Directory.EnumerateFiles(inputDirectory)
    .Where(file => supportedExtensions.Contains(Path.GetExtension(file), StringComparer.OrdinalIgnoreCase))
    .Order()
    .ToList();

if (inputFiles.Count == 0)
{
    Console.Error.WriteLine($"No images found in: {inputDirectory}");
    return 1;
}

Directory.CreateDirectory(outputDirectory);

using var serviceProvider = new ServiceCollection()
    .AddImageProcessing()
    .BuildServiceProvider();

var codec = serviceProvider.GetRequiredService<IImageCodec>();
var processor = serviceProvider.GetRequiredService<IGarmentImageProcessor>();
var jsonOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web) { WriteIndented = true };
var failures = 0;

foreach (var inputFile in inputFiles)
{
    var fileName = Path.GetFileNameWithoutExtension(inputFile);

    try
    {
        Console.WriteLine($"Processing {Path.GetFileName(inputFile)}...");

        var image = codec.Decode(await File.ReadAllBytesAsync(inputFile));
        var result = processor.Process(image);

        var imagePath = Path.Combine(outputDirectory, $"{fileName}.png");
        var landmarksPath = Path.Combine(outputDirectory, $"{fileName}.landmarks.json");

        await File.WriteAllBytesAsync(imagePath, codec.EncodePng(result.Image));
        await File.WriteAllTextAsync(landmarksPath, JsonSerializer.Serialize(result.Landmarks, jsonOptions));

        Console.WriteLine($"  {image.Width}x{image.Height} -> {result.Image.Width}x{result.Image.Height}: {imagePath}");
    }
    catch (Exception exception) when (exception is InvalidOperationException or IOException)
    {
        failures++;
        Console.Error.WriteLine($"  Failed: {exception.Message}");
    }
}

Console.WriteLine($"Done. {inputFiles.Count - failures} processed, {failures} failed. Output: {outputDirectory}");

return failures == 0 ? 0 : 1;
