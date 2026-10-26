using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public interface IForegroundMaskBuilder
{
    PixelMask Build(PixelImage image);
}
