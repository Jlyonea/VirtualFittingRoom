using VirtualFittingRoom.Application.Models.ImageProcessing;
using VirtualFittingRoom.Application.Services.ImageProcessing;

namespace VirtualFittingRoom.Application.Tests.Services.ImageProcessing;

public class BackgroundColorEstimatorTests
{
    private readonly BackgroundColorEstimator _estimator = new();

    [Fact]
    public void Estimate_ShouldReturnMedianBorderColor_WhenMostBorderPixelsAreBackground()
    {
        var image = TestImages.FromPattern(
            "....",
            ".##.",
            ".##.",
            "...#");

        var color = _estimator.Estimate(image);

        Assert.Equal(TestImages.White, color);
    }

    [Fact]
    public void Estimate_ShouldReturnOpaqueColor_WhenBorderIsGray()
    {
        var image = TestImages.FromPattern(
            "ggg",
            "g#g",
            "ggg");

        var color = _estimator.Estimate(image);

        Assert.Equal(TestImages.Gray, color);
    }
}
