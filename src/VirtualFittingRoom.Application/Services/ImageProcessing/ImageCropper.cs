using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

// Copies the pixels inside the bounds; pixels outside the mask become transparent.
public sealed class ImageCropper : IImageCropper
{
    public PixelImage Crop(PixelImage image, PixelMask mask, PixelBounds bounds)
    {
        ArgumentNullException.ThrowIfNull(image);
        ArgumentNullException.ThrowIfNull(mask);

        var result = new PixelImage(bounds.Width, bounds.Height);

        for (var y = 0; y < bounds.Height; y++)
        {
            for (var x = 0; x < bounds.Width; x++)
            {
                var sourceX = bounds.Left + x;
                var sourceY = bounds.Top + y;

                result[x, y] = mask[sourceX, sourceY] ? image[sourceX, sourceY] : Rgba.Transparent;
            }
        }

        return result;
    }
}
