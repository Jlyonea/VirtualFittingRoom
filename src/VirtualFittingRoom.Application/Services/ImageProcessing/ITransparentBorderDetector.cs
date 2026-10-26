using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public interface ITransparentBorderDetector
{
    bool HasTransparentBorder(PixelImage image);
}
