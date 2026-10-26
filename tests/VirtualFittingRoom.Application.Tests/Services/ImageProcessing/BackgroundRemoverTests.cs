using NSubstitute;
using VirtualFittingRoom.Application.Models.ImageProcessing;
using VirtualFittingRoom.Application.Services.ImageProcessing;

namespace VirtualFittingRoom.Application.Tests.Services.ImageProcessing;

public class BackgroundRemoverTests
{
    private readonly ITransparentBorderDetector _transparentBorderDetector = Substitute.For<ITransparentBorderDetector>();
    private readonly IBackgroundColorEstimator _backgroundColorEstimator = Substitute.For<IBackgroundColorEstimator>();
    private readonly BackgroundRemover _remover;

    public BackgroundRemoverTests()
    {
        _backgroundColorEstimator.Estimate(Arg.Any<PixelImage>()).Returns(TestImages.White);
        _remover = new BackgroundRemover(_transparentBorderDetector, _backgroundColorEstimator, new ImageProcessingOptions());
    }

    [Fact]
    public void RemoveBackground_ShouldClearBackgroundConnectedToBorder()
    {
        var image = TestImages.FromPattern(
            ".....",
            ".###.",
            ".###.",
            ".....");

        var result = _remover.RemoveBackground(image);

        Assert.Equal(
            new[]
            {
                "     ",
                " ### ",
                " ### ",
                "     ",
            },
            TestImages.ToTransparencyPattern(result));
    }

    [Fact]
    public void RemoveBackground_ShouldKeepBackgroundColoredAreasEnclosedByGarment()
    {
        var image = TestImages.FromPattern(
            ".....",
            ".###.",
            ".#w#.",
            ".###.",
            ".....");

        var result = _remover.RemoveBackground(image);

        Assert.Equal(TestImages.White, result[2, 2]);
    }

    [Fact]
    public void RemoveBackground_ShouldTreatColorsWithinToleranceAsBackground()
    {
        var image = TestImages.FromPattern(
            "..g..",
            ".###.",
            ".....");

        var result = _remover.RemoveBackground(image);

        Assert.Equal(Rgba.Transparent, result[2, 0]);
    }

    [Fact]
    public void RemoveBackground_ShouldReturnUnchangedCopy_WhenBorderIsAlreadyTransparent()
    {
        var image = TestImages.FromPattern(
            "     ",
            " ... ",
            "     ");
        _transparentBorderDetector.HasTransparentBorder(image).Returns(true);

        var result = _remover.RemoveBackground(image);

        Assert.NotSame(image, result);
        Assert.Equal(TestImages.White, result[2, 1]);
        _backgroundColorEstimator.DidNotReceive().Estimate(Arg.Any<PixelImage>());
    }

    [Fact]
    public void RemoveBackground_ShouldNotChangeOriginalImage()
    {
        var image = TestImages.FromPattern(
            "...",
            ".#.",
            "...");

        _remover.RemoveBackground(image);

        Assert.Equal(TestImages.White, image[0, 0]);
    }
}
