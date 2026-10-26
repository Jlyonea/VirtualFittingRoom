using VirtualFittingRoom.Application.Models.ImageProcessing;
using VirtualFittingRoom.Application.Services.ImageProcessing;

namespace VirtualFittingRoom.Application.Tests.Services.ImageProcessing;

public class ForegroundMaskBuilderTests
{
    [Fact]
    public void Build_ShouldMarkOpaquePixelsAsForeground()
    {
        var image = TestImages.FromPattern(
            " # ",
            "## ");
        var builder = new ForegroundMaskBuilder(new ImageProcessingOptions());

        var mask = builder.Build(image);

        Assert.Equal(new[] { ".#.", "##." }, TestImages.ToPattern(mask));
    }

    [Fact]
    public void Build_ShouldTreatPixelsBelowAlphaThresholdAsBackground()
    {
        var image = new PixelImage(2, 1);
        image[0, 0] = new Rgba(10, 10, 10, 127);
        image[1, 0] = new Rgba(10, 10, 10, 128);
        var builder = new ForegroundMaskBuilder(new ImageProcessingOptions());

        var mask = builder.Build(image);

        Assert.False(mask[0, 0]);
        Assert.True(mask[1, 0]);
    }
}
