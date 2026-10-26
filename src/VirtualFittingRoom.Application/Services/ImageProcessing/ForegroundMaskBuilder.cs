using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public sealed class ForegroundMaskBuilder(ImageProcessingOptions options) : IForegroundMaskBuilder
{
    public PixelMask Build(PixelImage image)
    {
        ArgumentNullException.ThrowIfNull(image);

        var mask = new PixelMask(image.Width, image.Height);

        for (var y = 0; y < image.Height; y++)
        {
            for (var x = 0; x < image.Width; x++)
            {
                mask[x, y] = image[x, y].A >= options.AlphaThreshold;
            }
        }

        return mask;
    }
}
