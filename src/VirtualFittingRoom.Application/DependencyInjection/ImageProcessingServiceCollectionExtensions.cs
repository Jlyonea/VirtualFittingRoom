using Microsoft.Extensions.DependencyInjection;
using VirtualFittingRoom.Application.Models.ImageProcessing;
using VirtualFittingRoom.Application.Services.ImageProcessing;

namespace VirtualFittingRoom.Application.DependencyInjection;

public static class ImageProcessingServiceCollectionExtensions
{
    public static IServiceCollection AddImageProcessing(this IServiceCollection services, ImageProcessingOptions? options = null)
    {
        ArgumentNullException.ThrowIfNull(services);

        services.AddSingleton(options ?? new ImageProcessingOptions());
        services.AddSingleton<ITransparentBorderDetector, TransparentBorderDetector>();
        services.AddSingleton<IBackgroundColorEstimator, BackgroundColorEstimator>();
        services.AddSingleton<IBackgroundRemover, BackgroundRemover>();
        services.AddSingleton<IForegroundMaskBuilder, ForegroundMaskBuilder>();
        services.AddSingleton<ILargestComponentFilter, LargestComponentFilter>();
        services.AddSingleton<IMaskBoundsCalculator, MaskBoundsCalculator>();
        services.AddSingleton<IImageCropper, ImageCropper>();
        services.AddSingleton<IShirtLandmarkDetector, ShirtLandmarkDetector>();
        services.AddSingleton<IImageCodec, SkiaImageCodec>();
        services.AddSingleton<IGarmentImageProcessor, GarmentImageProcessor>();

        return services;
    }
}
