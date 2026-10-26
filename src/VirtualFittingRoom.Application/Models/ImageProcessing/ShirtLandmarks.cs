namespace VirtualFittingRoom.Application.Models.ImageProcessing;

// Left and right refer to the image sides, not to the wearer's sides.
public sealed record ShirtLandmarks(
    NormalizedPoint CollarCenter,
    NormalizedPoint NeckLeft,
    NormalizedPoint NeckRight,
    NormalizedPoint SleeveLeftTip,
    NormalizedPoint SleeveRightTip,
    NormalizedPoint ArmpitLeft,
    NormalizedPoint ArmpitRight,
    NormalizedPoint HemLeft,
    NormalizedPoint HemRight);
