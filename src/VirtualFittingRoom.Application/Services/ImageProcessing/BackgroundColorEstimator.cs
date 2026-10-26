using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public sealed class BackgroundColorEstimator : IBackgroundColorEstimator
{
    public Rgba Estimate(PixelImage image)
    {
        ArgumentNullException.ThrowIfNull(image);

        var borderPixels = ImageBorder.EnumerateCoordinates(image.Width, image.Height)
            .Select(coordinate => image[coordinate.X, coordinate.Y])
            .ToList();

        return new Rgba(
            Median(borderPixels.Select(pixel => pixel.R)),
            Median(borderPixels.Select(pixel => pixel.G)),
            Median(borderPixels.Select(pixel => pixel.B)),
            byte.MaxValue);
    }

    private static byte Median(IEnumerable<byte> values)
    {
        var sorted = values.Order().ToArray();

        return sorted[sorted.Length / 2];
    }
}
