using System.Runtime.InteropServices;
using SkiaSharp;
using VirtualFittingRoom.Application.Models.ImageProcessing;

namespace VirtualFittingRoom.Application.Services.ImageProcessing;

public sealed class SkiaImageCodec : IImageCodec
{
    private const int BytesPerPixel = 4;

    public PixelImage Decode(byte[] encodedImage)
    {
        ArgumentNullException.ThrowIfNull(encodedImage);

        using var data = SKData.CreateCopy(encodedImage);
        using var codec = SKCodec.Create(data) ?? throw new InvalidOperationException("The image format is not supported.");

        var info = new SKImageInfo(codec.Info.Width, codec.Info.Height, SKColorType.Rgba8888, SKAlphaType.Unpremul);
        using var bitmap = new SKBitmap(info);
        var decodeResult = codec.GetPixels(info, bitmap.GetPixels());

        if (decodeResult is not (SKCodecResult.Success or SKCodecResult.IncompleteInput))
        {
            throw new InvalidOperationException($"The image could not be decoded: {decodeResult}.");
        }

        var rowBuffer = new byte[info.Width * BytesPerPixel];
        var pixels = new Rgba[info.Width * info.Height];
        var pixelsAddress = bitmap.GetPixels();

        for (var y = 0; y < info.Height; y++)
        {
            Marshal.Copy(pixelsAddress + (y * bitmap.RowBytes), rowBuffer, 0, rowBuffer.Length);

            for (var x = 0; x < info.Width; x++)
            {
                var offset = x * BytesPerPixel;
                pixels[(y * info.Width) + x] = new Rgba(rowBuffer[offset], rowBuffer[offset + 1], rowBuffer[offset + 2], rowBuffer[offset + 3]);
            }
        }

        return new PixelImage(info.Width, info.Height, pixels);
    }

    public byte[] EncodePng(PixelImage image)
    {
        ArgumentNullException.ThrowIfNull(image);

        var info = new SKImageInfo(image.Width, image.Height, SKColorType.Rgba8888, SKAlphaType.Unpremul);
        using var bitmap = new SKBitmap(info);
        var rowBuffer = new byte[image.Width * BytesPerPixel];
        var pixelsAddress = bitmap.GetPixels();

        for (var y = 0; y < image.Height; y++)
        {
            for (var x = 0; x < image.Width; x++)
            {
                var pixel = image[x, y];
                var offset = x * BytesPerPixel;

                rowBuffer[offset] = pixel.R;
                rowBuffer[offset + 1] = pixel.G;
                rowBuffer[offset + 2] = pixel.B;
                rowBuffer[offset + 3] = pixel.A;
            }

            Marshal.Copy(rowBuffer, 0, pixelsAddress + (y * bitmap.RowBytes), rowBuffer.Length);
        }

        using var encoded = bitmap.Encode(SKEncodedImageFormat.Png, 100);

        return encoded.ToArray();
    }
}
