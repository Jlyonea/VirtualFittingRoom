using VirtualFittingRoom.Application.Models.ImageProcessing;
using VirtualFittingRoom.Application.Services.ImageProcessing;

namespace VirtualFittingRoom.Application.Tests.Services.ImageProcessing;

public class ImageCropperTests
{
    [Fact]
    public void Crop_ShouldCopyMaskedPixelsInsideBoundsAndClearTheRest()
    {
        var image = TestImages.FromPattern(
            "#....",
            ".##..",
            ".#w..");
        var mask = TestImages.MaskFromPattern(
            ".....",
            ".##..",
            ".#...");
        var cropper = new ImageCropper();

        var result = cropper.Crop(image, mask, new PixelBounds(1, 1, 2, 2));

        Assert.Equal(2, result.Width);
        Assert.Equal(2, result.Height);
        Assert.Equal(TestImages.Red, result[0, 0]);
        Assert.Equal(TestImages.Red, result[1, 0]);
        Assert.Equal(TestImages.Red, result[0, 1]);
        Assert.Equal(Rgba.Transparent, result[1, 1]);
    }
}
