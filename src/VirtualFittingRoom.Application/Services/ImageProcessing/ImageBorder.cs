namespace VirtualFittingRoom.Application.Services.ImageProcessing;

internal static class ImageBorder
{
    public static IEnumerable<(int X, int Y)> EnumerateCoordinates(int width, int height)
    {
        for (var x = 0; x < width; x++)
        {
            yield return (x, 0);

            if (height > 1)
            {
                yield return (x, height - 1);
            }
        }

        for (var y = 1; y < height - 1; y++)
        {
            yield return (0, y);

            if (width > 1)
            {
                yield return (width - 1, y);
            }
        }
    }
}
