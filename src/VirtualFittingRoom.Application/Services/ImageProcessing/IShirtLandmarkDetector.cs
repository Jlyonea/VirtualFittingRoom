using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public interface IShirtLandmarkDetector
{
    ShirtLandmarks Detect(PixelMask mask, PixelBounds bounds);
}
