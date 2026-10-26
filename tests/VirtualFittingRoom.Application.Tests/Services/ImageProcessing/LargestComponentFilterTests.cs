using VirtualFittingRoom.Application.Services.ImageProcessing;

namespace VirtualFittingRoom.Application.Tests.Services.ImageProcessing;

public class LargestComponentFilterTests
{
    private readonly LargestComponentFilter _filter = new();

    [Fact]
    public void Filter_ShouldKeepOnlyLargestConnectedComponent()
    {
        var mask = TestImages.MaskFromPattern(
            "#.....",
            "..###.",
            "..###.",
            ".....#");

        var result = _filter.Filter(mask);

        Assert.Equal(
            new[]
            {
                "......",
                "..###.",
                "..###.",
                "......",
            },
            TestImages.ToPattern(result));
    }

    [Fact]
    public void Filter_ShouldNotConnectDiagonalPixels()
    {
        var mask = TestImages.MaskFromPattern(
            "##..",
            "..#.",
            "....");

        var result = _filter.Filter(mask);

        Assert.Equal(new[] { "##..", "....", "...." }, TestImages.ToPattern(result));
    }

    [Fact]
    public void Filter_ShouldReturnEmptyMask_WhenMaskIsEmpty()
    {
        var mask = TestImages.MaskFromPattern("...", "...");

        var result = _filter.Filter(mask);

        Assert.Equal(new[] { "...", "..." }, TestImages.ToPattern(result));
    }
}
