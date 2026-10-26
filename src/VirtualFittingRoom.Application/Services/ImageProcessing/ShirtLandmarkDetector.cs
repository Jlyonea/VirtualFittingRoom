using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

// Detects shirt key points from the garment silhouette of a front or back photo (flat lay or ghost mannequin).
// Results are normalized to the bounds, so they match the cropped garment image.
public sealed class ShirtLandmarkDetector : IShirtLandmarkDetector
{
    private const double HemRowOffsetRatio = 0.02;
    private const double NeckSearchHalfWidthRatio = 0.25;

    public ShirtLandmarks Detect(PixelMask mask, PixelBounds bounds)
    {
        ArgumentNullException.ThrowIfNull(mask);

        var rowExtents = CalculateRowExtents(mask, bounds);
        var columnTops = CalculateColumnTops(mask, bounds);

        var sleeveLeftTip = FindSleeveTip(rowExtents, bounds, bounds.Left, extent => extent.Left);
        var sleeveRightTip = FindSleeveTip(rowExtents, bounds, bounds.Right, extent => extent.Right);

        var hemY = bounds.Bottom - (int)Math.Round(bounds.Height * HemRowOffsetRatio);
        var hemExtent = GetExtent(rowExtents, bounds, hemY);
        var hemLeft = (X: hemExtent.Left, Y: hemY);
        var hemRight = (X: hemExtent.Right, Y: hemY);

        var centerX = (bounds.Left + bounds.Right) / 2;
        var searchHalfWidth = Math.Max(1, (int)Math.Round(bounds.Width * NeckSearchHalfWidthRatio));
        var neckLeft = FindHighestColumn(columnTops, bounds, centerX - 1, Math.Max(bounds.Left, centerX - searchHalfWidth));
        var neckRight = FindHighestColumn(columnTops, bounds, centerX + 1, Math.Min(bounds.Right, centerX + searchHalfWidth));
        var collarCenter = FindCollarCenter(columnTops, bounds, neckLeft.X, neckRight.X, centerX);

        var armpitLeft = FindArmpit(rowExtents, bounds, sleeveLeftTip, hemLeft, extent => extent.Left, isLeftSide: true);
        var armpitRight = FindArmpit(rowExtents, bounds, sleeveRightTip, hemRight, extent => extent.Right, isLeftSide: false);

        return new ShirtLandmarks(
            Normalize(collarCenter, bounds),
            Normalize(neckLeft, bounds),
            Normalize(neckRight, bounds),
            Normalize(sleeveLeftTip, bounds),
            Normalize(sleeveRightTip, bounds),
            Normalize(armpitLeft, bounds),
            Normalize(armpitRight, bounds),
            Normalize(hemLeft, bounds),
            Normalize(hemRight, bounds));
    }

    private static (int Left, int Right)?[] CalculateRowExtents(PixelMask mask, PixelBounds bounds)
    {
        var extents = new (int Left, int Right)?[bounds.Height];

        for (var y = bounds.Top; y <= bounds.Bottom; y++)
        {
            for (var x = bounds.Left; x <= bounds.Right; x++)
            {
                if (!mask[x, y])
                {
                    continue;
                }

                var current = extents[y - bounds.Top];
                extents[y - bounds.Top] = current is null ? (x, x) : (current.Value.Left, x);
            }
        }

        return extents;
    }

    private static int?[] CalculateColumnTops(PixelMask mask, PixelBounds bounds)
    {
        var tops = new int?[bounds.Width];

        for (var x = bounds.Left; x <= bounds.Right; x++)
        {
            for (var y = bounds.Top; y <= bounds.Bottom; y++)
            {
                if (mask[x, y])
                {
                    tops[x - bounds.Left] = y;
                    break;
                }
            }
        }

        return tops;
    }

    private static (int Left, int Right) GetExtent((int Left, int Right)?[] rowExtents, PixelBounds bounds, int y) =>
        rowExtents[y - bounds.Top] ?? throw new InvalidOperationException($"The garment has no pixels on row {y}.");

    private static (int X, int Y) FindSleeveTip(
        (int Left, int Right)?[] rowExtents,
        PixelBounds bounds,
        int edgeX,
        Func<(int Left, int Right), int> selectSide)
    {
        var rows = Enumerable.Range(bounds.Top, bounds.Height)
            .Where(y => rowExtents[y - bounds.Top] is { } extent && selectSide(extent) == edgeX)
            .ToList();

        return (edgeX, (rows.First() + rows.Last()) / 2);
    }

    // Walks from the center outwards and keeps the highest column; ties keep the column closest to the center.
    private static (int X, int Y) FindHighestColumn(int?[] columnTops, PixelBounds bounds, int fromX, int toX)
    {
        var step = toX >= fromX ? 1 : -1;
        (int X, int Y)? highest = null;

        for (var x = fromX; x != toX + step; x += step)
        {
            if (columnTops[x - bounds.Left] is { } top && (highest is null || top < highest.Value.Y))
            {
                highest = (x, top);
            }
        }

        return highest ?? throw new InvalidOperationException("The neck area of the garment could not be found.");
    }

    // The collar is the deepest column between both neck points; ties keep the column closest to the center.
    private static (int X, int Y) FindCollarCenter(int?[] columnTops, PixelBounds bounds, int neckLeftX, int neckRightX, int centerX)
    {
        (int X, int Y)? deepest = null;

        for (var x = neckLeftX + 1; x < neckRightX; x++)
        {
            if (columnTops[x - bounds.Left] is not { } top)
            {
                continue;
            }

            var isDeeper = deepest is null || top > deepest.Value.Y;
            var isCloserTie = deepest is not null && top == deepest.Value.Y && Math.Abs(x - centerX) < Math.Abs(deepest.Value.X - centerX);

            if (isDeeper || isCloserTie)
            {
                deepest = (x, top);
            }
        }

        return deepest ?? (centerX, columnTops[centerX - bounds.Left] ?? bounds.Top);
    }

    // The armpit is the side contour point farthest inwards from the line between the sleeve tip and the hem.
    private static (int X, int Y) FindArmpit(
        (int Left, int Right)?[] rowExtents,
        PixelBounds bounds,
        (int X, int Y) sleeveTip,
        (int X, int Y) hem,
        Func<(int Left, int Right), int> selectSide,
        bool isLeftSide)
    {
        var armpit = sleeveTip;
        var largestDeviation = double.MinValue;

        for (var y = sleeveTip.Y + 1; y < hem.Y; y++)
        {
            if (rowExtents[y - bounds.Top] is not { } extent)
            {
                continue;
            }

            var contourX = selectSide(extent);
            var chordX = sleeveTip.X + ((double)(hem.X - sleeveTip.X) * (y - sleeveTip.Y) / (hem.Y - sleeveTip.Y));
            var deviation = isLeftSide ? contourX - chordX : chordX - contourX;

            if (deviation > largestDeviation)
            {
                largestDeviation = deviation;
                armpit = (contourX, y);
            }
        }

        return armpit;
    }

    private static NormalizedPoint Normalize((int X, int Y) point, PixelBounds bounds) =>
        new(
            (double)(point.X - bounds.Left) / Math.Max(1, bounds.Width - 1),
            (double)(point.Y - bounds.Top) / Math.Max(1, bounds.Height - 1));
}
