using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public interface IImageCropper
{
    PixelImage Crop(PixelImage image, PixelMask mask, PixelBounds bounds);
}
