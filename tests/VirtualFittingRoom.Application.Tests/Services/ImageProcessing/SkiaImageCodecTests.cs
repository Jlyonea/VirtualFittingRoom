using VirtualFittingRoom.Application.Models.ImageProcessing;
using VirtualFittingRoom.Application.Services.ImageProcessing;

namespace VirtualFittingRoom.Application.Tests.Services.ImageProcessing;

public class SkiaImageCodecTests
{
    [Fact]
    public void EncodePngAndDecode_ShouldPreservePixelsIncludingTransparency()
    {
        var codec = new SkiaImageCodec();
        var image = new PixelImage(2, 1);
        image[0, 0] = TestImages.Red;
        image[1, 0] = Rgba.Transparent;

        var decoded = codec.Decode(codec.EncodePng(image));

        Assert.Equal(2, decoded.Width);
        Assert.Equal(1, decoded.Height);
        Assert.Equal(TestImages.Red, decoded[0, 0]);
        Assert.Equal(0, decoded[1, 0].A);
    }

    [Fact]
    public void Decode_ShouldThrow_WhenBytesAreNotAnImage()
    {
        var codec = new SkiaImageCodec();

        Assert.Throws<InvalidOperationException>(() => codec.Decode([1, 2, 3, 4]));
    }
}
