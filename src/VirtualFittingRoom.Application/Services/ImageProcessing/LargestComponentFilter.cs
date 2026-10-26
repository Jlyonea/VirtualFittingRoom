using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

// Keeps only the largest 4-connected area of the mask, removing noise such as leftover background specks.
public sealed class LargestComponentFilter : ILargestComponentFilter
{
    public PixelMask Filter(PixelMask mask)
    {
        ArgumentNullException.ThrowIfNull(mask);

        var visited = new bool[mask.Width * mask.Height];
        var largestComponent = new List<(int X, int Y)>();

        for (var y = 0; y < mask.Height; y++)
        {
            for (var x = 0; x < mask.Width; x++)
            {
                if (!mask[x, y] || visited[(y * mask.Width) + x])
                {
                    continue;
                }

                var component = CollectComponent(mask, visited, x, y);

                if (component.Count > largestComponent.Count)
                {
                    largestComponent = component;
                }
            }
        }

        var result = new PixelMask(mask.Width, mask.Height);

        foreach (var (x, y) in largestComponent)
        {
            result[x, y] = true;
        }

        return result;
    }

    private static List<(int X, int Y)> CollectComponent(PixelMask mask, bool[] visited, int startX, int startY)
    {
        var component = new List<(int X, int Y)>();
        var pending = new Queue<(int X, int Y)>();

        visited[(startY * mask.Width) + startX] = true;
        pending.Enqueue((startX, startY));

        while (pending.Count > 0)
        {
            var (x, y) = pending.Dequeue();
            component.Add((x, y));

            foreach (var (neighborX, neighborY) in new[] { (x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1) })
            {
                if (neighborX < 0 || neighborY < 0 || neighborX >= mask.Width || neighborY >= mask.Height)
                {
                    continue;
                }

                var index = (neighborY * mask.Width) + neighborX;

                if (mask[neighborX, neighborY] && !visited[index])
                {
                    visited[index] = true;
                    pending.Enqueue((neighborX, neighborY));
                }
            }
        }

        return component;
    }
}
