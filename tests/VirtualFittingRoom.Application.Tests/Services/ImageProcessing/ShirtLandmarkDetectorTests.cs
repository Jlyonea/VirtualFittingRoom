using VirtualFittingRoom.Application.Models.ImageProcessing;
using VirtualFittingRoom.Application.Services.ImageProcessing;

namespace VirtualFittingRoom.Application.Tests.Services.ImageProcessing;

public class ShirtLandmarkDetectorTests
{
    private const int Precision = 6;

    private static readonly PixelMask ShirtMask = TestImages.MaskFromPattern(
        "....##...##....",
        "###############",
        "###############",
        "...#########...",
        "...#########...",
        "...#########...",
        "...#########...",
        "...#########...");

    private static readonly PixelBounds ShirtBounds = new(0, 0, 14, 7);

    private readonly ShirtLandmarkDetector _detector = new();

    [Fact]
    public void Detect_ShouldFindNeckAndCollar()
    {
        var landmarks = _detector.Detect(ShirtMask, ShirtBounds);

        AssertPoint(5, 0, landmarks.NeckLeft);
        AssertPoint(9, 0, landmarks.NeckRight);
        AssertPoint(7, 1, landmarks.CollarCenter);
    }

    [Fact]
    public void Detect_ShouldFindSleeveTips()
    {
        var landmarks = _detector.Detect(ShirtMask, ShirtBounds);

        AssertPoint(0, 1, landmarks.SleeveLeftTip);
        AssertPoint(14, 1, landmarks.SleeveRightTip);
    }

    [Fact]
    public void Detect_ShouldFindArmpits()
    {
        var landmarks = _detector.Detect(ShirtMask, ShirtBounds);

        AssertPoint(3, 3, landmarks.ArmpitLeft);
        AssertPoint(11, 3, landmarks.ArmpitRight);
    }

    [Fact]
    public void Detect_ShouldFindHem()
    {
        var landmarks = _detector.Detect(ShirtMask, ShirtBounds);

        AssertPoint(3, 7, landmarks.HemLeft);
        AssertPoint(11, 7, landmarks.HemRight);
    }

    [Fact]
    public void Detect_ShouldNormalizePointsRelativeToBounds()
    {
        var mask = new PixelMask(ShirtMask.Width + 4, ShirtMask.Height + 2);

        for (var y = 0; y < ShirtMask.Height; y++)
        {
            for (var x = 0; x < ShirtMask.Width; x++)
            {
                mask[x + 2, y + 1] = ShirtMask[x, y];
            }
        }

        var landmarks = _detector.Detect(mask, new PixelBounds(2, 1, 16, 8));

        AssertPoint(0, 1, landmarks.SleeveLeftTip);
        AssertPoint(11, 7, landmarks.HemRight);
    }

    private static void AssertPoint(int expectedX, int expectedY, NormalizedPoint actual)
    {
        Assert.Equal(expectedX / 14d, actual.X, Precision);
        Assert.Equal(expectedY / 7d, actual.Y, Precision);
    }
}
