using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

// Clears the background connected to the image borders, so garment areas with the background color
// (e.g. a white print on a white background) are kept.
public sealed class BackgroundRemover(
    ITransparentBorderDetector transparentBorderDetector,
    IBackgroundColorEstimator backgroundColorEstimator,
    ImageProcessingOptions options) : IBackgroundRemover
{
    public PixelImage RemoveBackground(PixelImage image)
    {
        ArgumentNullException.ThrowIfNull(image);

        var result = image.Clone();

        if (transparentBorderDetector.HasTransparentBorder(image))
        {
            return result;
        }

        var backgroundColor = backgroundColorEstimator.Estimate(image);
        var maxSquaredDistance = options.BackgroundColorTolerance * options.BackgroundColorTolerance;
        var visited = new bool[image.Width * image.Height];
        var pending = new Queue<(int X, int Y)>();

        void TryEnqueue(int x, int y)
        {
            if (x < 0 || y < 0 || x >= image.Width || y >= image.Height)
            {
                return;
            }

            var index = (y * image.Width) + x;

            if (visited[index])
            {
                return;
            }

            visited[index] = true;

            if (SquaredDistance(image[x, y], backgroundColor) <= maxSquaredDistance)
            {
                pending.Enqueue((x, y));
            }
        }

        foreach (var (x, y) in ImageBorder.EnumerateCoordinates(image.Width, image.Height))
        {
            TryEnqueue(x, y);
        }

        while (pending.Count > 0)
        {
            var (x, y) = pending.Dequeue();
            result[x, y] = Rgba.Transparent;

            TryEnqueue(x - 1, y);
            TryEnqueue(x + 1, y);
            TryEnqueue(x, y - 1);
            TryEnqueue(x, y + 1);
        }

        return result;
    }

    private static double SquaredDistance(Rgba first, Rgba second)
    {
        var red = first.R - second.R;
        var green = first.G - second.G;
        var blue = first.B - second.B;

        return (red * red) + (green * green) + (blue * blue);
    }
}
