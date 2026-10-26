namespace VirtualFittingRoom.Application.Models.ImageProcessing;

// Inclusive pixel bounds.
public readonly record struct PixelBounds(int Left, int Top, int Right, int Bottom)
{
    public int Width => Right - Left + 1;

    public int Height => Bottom - Top + 1;
}
