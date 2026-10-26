using VirtualFittingRoom.Application.Models.ImageProcessing;
using VirtualFittingRoom.Application.Services.ImageProcessing;

namespace VirtualFittingRoom.Application.Tests.Services.ImageProcessing;

public class TransparentBorderDetectorTests
{
    private readonly TransparentBorderDetector _detector = new(new ImageProcessingOptions());

    [Fact]
    public void HasTransparentBorder_ShouldReturnTrue_WhenBorderIsTransparent()
    {
        var image = TestImages.FromPattern(
            "    ",
            " ## ",
            "    ");

        Assert.True(_detector.HasTransparentBorder(image));
    }

    [Fact]
    public void HasTransparentBorder_ShouldReturnFalse_WhenBorderIsOpaque()
    {
        var image = TestImages.FromPattern(
            "....",
            ".## ",
            "....");

        Assert.False(_detector.HasTransparentBorder(image));
    }
}
