using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public interface IBackgroundRemover
{
    PixelImage RemoveBackground(PixelImage image);
}
