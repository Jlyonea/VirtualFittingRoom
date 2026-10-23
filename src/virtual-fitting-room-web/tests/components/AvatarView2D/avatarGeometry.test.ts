import { describe, expect, it } from 'vitest';
import {
  CANVAS_HEIGHT,
  CENTER_X,
  PIXELS_PER_CM,
  buildLegPoints,
  buildNeckPoints,
  buildPantsPoints,
  buildRectanglePoints,
  buildShirtPoints,
  buildTorsoPoints,
  calculateBodyLayout,
  circumferenceToWidth,
  toPixels,
  toPointsString,
} from '../../../src/components/AvatarView2D/avatarGeometry';
import { avatarFixture } from '../../fixtures/avatar';
import { pantsFixture, shirtFixture } from '../../fixtures/products';

const layout = calculateBodyLayout(avatarFixture.measurements);

describe('avatarGeometry', () => {
  it('toPixels_WithCentimeters_ReturnsScaledValue', () => {
    expect(toPixels(10)).toBe(10 * PIXELS_PER_CM);
  });

  it('circumferenceToWidth_WithCircumference_ReturnsDiameterInPixels', () => {
    expect(circumferenceToWidth(100)).toBeCloseTo(toPixels(100 / Math.PI));
  });

  it('toPointsString_WithPoints_ReturnsSvgPointsFormat', () => {
    expect(toPointsString([{ x: 1, y: 2 }, { x: 3, y: 4 }])).toBe('1,2 3,4');
  });

  it('buildRectanglePoints_WithBounds_ReturnsFourCornersClockwise', () => {
    expect(buildRectanglePoints(0, 10, 20, 30)).toEqual([
      { x: 0, y: 10 },
      { x: 20, y: 10 },
      { x: 20, y: 30 },
      { x: 0, y: 30 },
    ]);
  });

  it('calculateBodyLayout_WithMeasurements_PlacesBodyBetweenHeightTopAndCanvasBottom', () => {
    const expectedTopY = CANVAS_HEIGHT - toPixels(avatarFixture.measurements.heightCm);

    expect(layout.headCenterY - layout.headRadius).toBeCloseTo(expectedTopY);
    expect(layout.feetY).toBe(CANVAS_HEIGHT);
  });

  it('calculateBodyLayout_WithMeasurements_OrdersBodyLinesFromTopToBottom', () => {
    const lines = [layout.neckTopY, layout.chestY, layout.waistY, layout.hipY, layout.crotchY, layout.feetY];

    expect([...lines].sort((first, second) => first - second)).toEqual(lines);
  });

  it('calculateBodyLayout_WithMeasurements_ConvertsCircumferencesToWidths', () => {
    expect(layout.chestWidth).toBeCloseTo(circumferenceToWidth(avatarFixture.measurements.chestCm));
    expect(layout.waistWidth).toBeCloseTo(circumferenceToWidth(avatarFixture.measurements.waistCm));
    expect(layout.hipWidth).toBeCloseTo(circumferenceToWidth(avatarFixture.measurements.hipCm));
  });

  it('buildNeckPoints_WithLayout_ConnectsHeadToChest', () => {
    const points = buildNeckPoints(layout);

    expect(points[0].y).toBe(layout.neckTopY);
    expect(points[2].y).toBe(layout.chestY);
    expect(points[0].x + points[1].x).toBeCloseTo(CENTER_X * 2);
  });

  it('buildTorsoPoints_WithLayout_UsesChestAndHipWidths', () => {
    const points = buildTorsoPoints(layout);

    expect(points[1].x - points[0].x).toBeCloseTo(layout.chestWidth);
    expect(points[3].x - points[4].x).toBeCloseTo(layout.hipWidth);
  });

  it('buildLegPoints_WithLayout_ReturnsTwoLegsReachingFeet', () => {
    const legs = buildLegPoints(layout);

    expect(legs).toHaveLength(2);
    legs.forEach((legPoints) => expect(legPoints[2].y).toBe(layout.feetY));
  });

  it('buildShirtPoints_WithShirtMeasurements_UsesShirtChestAndLength', () => {
    const points = buildShirtPoints(layout, shirtFixture.measurements);

    expect(points[1].x - points[0].x).toBeCloseTo(circumferenceToWidth(shirtFixture.measurements.chestCm));
    expect(points[2].y).toBeCloseTo(layout.chestY + toPixels(shirtFixture.measurements.lengthCm));
  });

  it('buildPantsPoints_WithPantsMeasurements_StartsAtWaistAndEndsAtPantsLength', () => {
    const points = buildPantsPoints(layout, pantsFixture.measurements);

    expect(points[0].y).toBe(layout.waistY);
    expect(points[1].x - points[0].x).toBeCloseTo(circumferenceToWidth(pantsFixture.measurements.waistCm));
    expect(points[3].y).toBeCloseTo(layout.waistY + toPixels(pantsFixture.measurements.lengthCm));
  });
});
