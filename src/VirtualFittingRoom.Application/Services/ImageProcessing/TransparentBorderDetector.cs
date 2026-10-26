using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public sealed class TransparentBorderDetector(ImageProcessingOptions options) : ITransparentBorderDetector
{
    public bool HasTransparentBorder(PixelImage image)
    {
        ArgumentNullException.ThrowIfNull(image);

        var borderCount = 0;
        var transparentCount = 0;

        foreach (var (x, y) in ImageBorder.EnumerateCoordinates(image.Width, image.Height))
        {
            borderCount++;

            if (image[x, y].A < options.AlphaThreshold)
            {
                transparentCount++;
            }
        }

        return (double)transparentCount / borderCount >= options.TransparentBorderRatio;
    }
}
