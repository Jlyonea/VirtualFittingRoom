using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public interface ILargestComponentFilter
{
    PixelMask Filter(PixelMask mask);
}
