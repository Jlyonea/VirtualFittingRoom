namespace VirtualFittingRoom.Application.Models.ImageProcessing;

// Point relative to the cropped garment image: (0, 0) is the top-left corner and (1, 1) the bottom-right corner.
public sealed record NormalizedPoint(double X, double Y);
