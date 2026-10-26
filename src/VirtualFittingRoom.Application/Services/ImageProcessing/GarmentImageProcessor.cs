using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public sealed class GarmentImageProcessor(
    IBackgroundRemover backgroundRemover,
    IForegroundMaskBuilder foregroundMaskBuilder,
    ILargestComponentFilter largestComponentFilter,
    IMaskBoundsCalculator maskBoundsCalculator,
    IImageCropper imageCropper,
    IShirtLandmarkDetector shirtLandmarkDetector) : IGarmentImageProcessor
{
    public ProcessedGarmentImage Process(PixelImage image)
    {
        ArgumentNullException.ThrowIfNull(image);

        var withoutBackground = backgroundRemover.RemoveBackground(image);
        var foregroundMask = foregroundMaskBuilder.Build(withoutBackground);
        var garmentMask = largestComponentFilter.Filter(foregroundMask);
        var bounds = maskBoundsCalculator.Calculate(garmentMask);
        var croppedImage = imageCropper.Crop(withoutBackground, garmentMask, bounds);
        var landmarks = shirtLandmarkDetector.Detect(garmentMask, bounds);

        return new ProcessedGarmentImage(croppedImage, landmarks);
    }
}
