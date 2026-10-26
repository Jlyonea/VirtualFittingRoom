namespace VirtualFittingRoom.Application.Models.ImageProcessing;

public sealed class PixelImage
{
    private readonly Rgba[] _pixels;

    public PixelImage(int width, int height)
        : this(width, height, new Rgba[GetPixelCount(width, height)])
    {
    }

    public PixelImage(int width, int height, Rgba[] pixels)
    {
        ArgumentNullException.ThrowIfNull(pixels);

        if (pixels.Length != GetPixelCount(width, height))
        {
            throw new ArgumentException("Pixel count does not match the image size.", nameof(pixels));
        }

        Width = width;
        Height = height;
        _pixels = pixels;
    }

    public int Width { get; }

    public int Height { get; }

    public Rgba this[int x, int y]
    {
        get => _pixels[(y * Width) + x];
        set => _pixels[(y * Width) + x] = value;
    }

    public PixelImage Clone() => new(Width, Height, (Rgba[])_pixels.Clone());

    private static int GetPixelCount(int width, int height)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(width);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(height);

        return width * height;
    }
}
