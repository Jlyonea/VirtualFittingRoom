using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public interface IBackgroundColorEstimator
{
    Rgba Estimate(PixelImage image);
}
