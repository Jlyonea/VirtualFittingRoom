namespace VirtualFittingRoom.Application.Models.ImageProcessing;

public sealed class PixelMask
{
    private readonly bool[] _values;

    public PixelMask(int width, int height)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(width);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(height);

        Width = width;
        Height = height;
        _values = new bool[width * height];
    }

    public int Width { get; }

    public int Height { get; }

    public bool this[int x, int y]
    {
        get => _values[(y * Width) + x];
        set => _values[(y * Width) + x] = value;
    }
}
