using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public interface IGarmentImageProcessor
{
    ProcessedGarmentImage Process(PixelImage image);
}
