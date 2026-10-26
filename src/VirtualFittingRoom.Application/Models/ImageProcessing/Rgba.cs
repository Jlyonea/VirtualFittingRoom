namespace VirtualFittingRoom.Application.Models.ImageProcessing;

public readonly record struct Rgba(byte R, byte G, byte B, byte A)
{
    public static readonly Rgba Transparent = new(0, 0, 0, 0);
}
