using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public sealed class MaskBoundsCalculator : IMaskBoundsCalculator
{
    public PixelBounds Calculate(PixelMask mask)
    {
        ArgumentNullException.ThrowIfNull(mask);

        var left = int.MaxValue;
        var top = int.MaxValue;
        var right = int.MinValue;
        var bottom = int.MinValue;

        for (var y = 0; y < mask.Height; y++)
        {
            for (var x = 0; x < mask.Width; x++)
            {
                if (!mask[x, y])
                {
                    continue;
                }

                left = Math.Min(left, x);
                top = Math.Min(top, y);
                right = Math.Max(right, x);
                bottom = Math.Max(bottom, y);
            }
        }

        if (left == int.MaxValue)
        {
            throw new InvalidOperationException("No garment was found in the image.");
        }

        return new PixelBounds(left, top, right, bottom);
    }
}
