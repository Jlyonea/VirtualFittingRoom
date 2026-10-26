using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public interface IMaskBoundsCalculator
{
    PixelBounds Calculate(PixelMask mask);
}
