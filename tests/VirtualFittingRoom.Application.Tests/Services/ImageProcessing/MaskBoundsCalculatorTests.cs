using VirtualFittingRoom.Application.Models.ImageProcessing;
using VirtualFittingRoom.Application.Services.ImageProcessing;

namespace VirtualFittingRoom.Application.Tests.Services.ImageProcessing;

public class MaskBoundsCalculatorTests
{
    private readonly MaskBoundsCalculator _calculator = new();

    [Fact]
    public void Calculate_ShouldReturnInclusiveBoundsOfForeground()
    {
        var mask = TestImages.MaskFromPattern(
            "......",
            "..#...",
            ".###..",
            "......");

        var bounds = _calculator.Calculate(mask);

        Assert.Equal(new PixelBounds(1, 1, 3, 2), bounds);
        Assert.Equal(3, bounds.Width);
        Assert.Equal(2, bounds.Height);
    }

    [Fact]
    public void Calculate_ShouldThrow_WhenMaskIsEmpty()
    {
        var mask = TestImages.MaskFromPattern("..", "..");

        Assert.Throws<InvalidOperationException>(() => _calculator.Calculate(mask));
    }
}
