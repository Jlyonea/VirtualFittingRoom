using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public interface IImageCodec
{
    PixelImage Decode(byte[] encodedImage);

    byte[] EncodePng(PixelImage image);
}
