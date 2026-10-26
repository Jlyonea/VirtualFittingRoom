using NSubstitute;
using VirtualFittingRoom.Application.Models.ImageProcessing;
using VirtualFittingRoom.Application.Services.ImageProcessing;

namespace VirtualFittingRoom.Application.Tests.Services.ImageProcessing;

public class GarmentImageProcessorTests
{
    [Fact]
    public void Process_ShouldRunPipelineAndReturnCroppedImageWithLandmarks()
    {
        var backgroundRemover = Substitute.For<IBackgroundRemover>();
        var foregroundMaskBuilder = Substitute.For<IForegroundMaskBuilder>();
        var largestComponentFilter = Substitute.For<ILargestComponentFilter>();
        var maskBoundsCalculator = Substitute.For<IMaskBoundsCalculator>();
        var imageCropper = Substitute.For<IImageCropper>();
        var shirtLandmarkDetector = Substitute.For<IShirtLandmarkDetector>();

        var original = new PixelImage(4, 4);
        var withoutBackground = new PixelImage(4, 4);
        var foregroundMask = new PixelMask(4, 4);
        var garmentMask = new PixelMask(4, 4);
        var bounds = new PixelBounds(1, 1, 2, 2);
        var cropped = new PixelImage(2, 2);
        var point = new NormalizedPoint(0, 0);
        var landmarks = new ShirtLandmarks(point, point, point, point, point, point, point, point, point);

        backgroundRemover.RemoveBackground(original).Returns(withoutBackground);
        foregroundMaskBuilder.Build(withoutBackground).Returns(foregroundMask);
        largestComponentFilter.Filter(foregroundMask).Returns(garmentMask);
        maskBoundsCalculator.Calculate(garmentMask).Returns(bounds);
        imageCropper.Crop(withoutBackground, garmentMask, bounds).Returns(cropped);
        shirtLandmarkDetector.Detect(garmentMask, bounds).Returns(landmarks);

        var processor = new GarmentImageProcessor(
            backgroundRemover,
            foregroundMaskBuilder,
            largestComponentFilter,
            maskBoundsCalculator,
            imageCropper,
            shirtLandmarkDetector);

        var result = processor.Process(original);

        Assert.Same(cropped, result.Image);
        Assert.Same(landmarks, result.Landmarks);
    }
}
