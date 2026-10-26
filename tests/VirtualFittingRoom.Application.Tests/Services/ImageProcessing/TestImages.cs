using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Tests.Services.ImageProcessing;

internal static class TestImages
{
    public static readonly Rgba White = new(255, 255, 255, 255);
    public static readonly Rgba Red = new(200, 30, 30, 255);
    public static readonly Rgba Gray = new(240, 240, 240, 255);

    // '#' = red garment pixel, '.' = white background, 'w' = white pixel, 'g' = light gray pixel, ' ' = transparent pixel.
    public static PixelImage FromPattern(params string[] rows)
    {
        var image = new PixelImage(rows[0].Length, rows.Length);

        for (var y = 0; y < rows.Length; y++)
        {
            for (var x = 0; x < rows[y].Length; x++)
            {
                image[x, y] = rows[y][x] switch
                {
                    '#' => Red,
                    '.' or 'w' => White,
                    'g' => Gray,
                    ' ' => Rgba.Transparent,
                    var symbol => throw new ArgumentException($"Unknown symbol '{symbol}'.", nameof(rows)),
                };
            }
        }

        return image;
    }

    // '#' = true, any other symbol = false.
    public static PixelMask MaskFromPattern(params string[] rows)
    {
        var mask = new PixelMask(rows[0].Length, rows.Length);

        for (var y = 0; y < rows.Length; y++)
        {
            for (var x = 0; x < rows[y].Length; x++)
            {
                mask[x, y] = rows[y][x] == '#';
            }
        }

        return mask;
    }

    public static string[] ToPattern(PixelMask mask)
    {
        var rows = new string[mask.Height];

        for (var y = 0; y < mask.Height; y++)
        {
            rows[y] = string.Concat(Enumerable.Range(0, mask.Width).Select(x => mask[x, y] ? '#' : '.'));
        }

        return rows;
    }

    public static string[] ToTransparencyPattern(PixelImage image)
    {
        var rows = new string[image.Height];

        for (var y = 0; y < image.Height; y++)
        {
            rows[y] = string.Concat(Enumerable.Range(0, image.Width).Select(x => image[x, y].A == 0 ? ' ' : '#'));
        }

        return rows;
    }
}
