namespace VirtualFittingRoom.Application.Models.ImageProcessing;

public sealed record ImageProcessingOptions
{
    // Pixels with alpha at or above this value belong to the garment.
    public byte AlphaThreshold { get; init; } = 128;

    // Maximum RGB distance (0-441) between a pixel and the background color to be treated as background.
    public double BackgroundColorTolerance { get; init; } = 40;

    // Minimum share of transparent border pixels to consider the background already removed.
    public double TransparentBorderRatio { get; init; } = 0.5;
}
