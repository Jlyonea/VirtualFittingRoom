import type { BodyMeasurements } from '../../types/avatar';
import type { PantsMeasurements, ShirtMeasurements } from '../../types/product';

export const CANVAS_WIDTH = 200;
export const CANVAS_HEIGHT = 440;
export const PIXELS_PER_CM = 2;
export const CENTER_X = CANVAS_WIDTH / 2;

const HEAD_HEIGHT_RATIO = 0.13;
const CHEST_LINE_RATIO = 0.17;
const WAIST_LINE_RATIO = 0.38;
const HIP_LINE_RATIO = 0.48;
const CROTCH_LINE_RATIO = 0.52;
const NECK_WIDTH_RATIO = 0.3;
const LEG_GAP_PX = 2;

export interface Point {
  x: number;
  y: number;
}

export interface BodyLayout {
  headCenterY: number;
  headRadius: number;
  neckTopY: number;
  chestY: number;
  waistY: number;
  hipY: number;
  crotchY: number;
  feetY: number;
  chestWidth: number;
  waistWidth: number;
  hipWidth: number;
}

export function toPixels(centimeters: number): number {
  return centimeters * PIXELS_PER_CM;
}

export function circumferenceToWidth(circumferenceCm: number): number {
  return toPixels(circumferenceCm / Math.PI);
}

export function toPointsString(points: Point[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(' ');
}

export function buildRectanglePoints(left: number, top: number, right: number, bottom: number): Point[] {
  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom },
  ];
}

export function calculateBodyLayout(measurements: BodyMeasurements): BodyLayout {
  const bodyHeight = toPixels(measurements.heightCm);
  const topY = CANVAS_HEIGHT - bodyHeight;
  const headRadius = (bodyHeight * HEAD_HEIGHT_RATIO) / 2;

  return {
    headCenterY: topY + headRadius,
    headRadius,
    neckTopY: topY + headRadius * 2,
    chestY: topY + bodyHeight * CHEST_LINE_RATIO,
    waistY: topY + bodyHeight * WAIST_LINE_RATIO,
    hipY: topY + bodyHeight * HIP_LINE_RATIO,
    crotchY: topY + bodyHeight * CROTCH_LINE_RATIO,
    feetY: CANVAS_HEIGHT,
    chestWidth: circumferenceToWidth(measurements.chestCm),
    waistWidth: circumferenceToWidth(measurements.waistCm),
    hipWidth: circumferenceToWidth(measurements.hipCm),
  };
}

export function buildNeckPoints(layout: BodyLayout): Point[] {
  const halfWidth = (layout.chestWidth * NECK_WIDTH_RATIO) / 2;

  return buildRectanglePoints(CENTER_X - halfWidth, layout.neckTopY, CENTER_X + halfWidth, layout.chestY);
}

export function buildTorsoPoints(layout: BodyLayout): Point[] {
  return [
    { x: CENTER_X - layout.chestWidth / 2, y: layout.chestY },
    { x: CENTER_X + layout.chestWidth / 2, y: layout.chestY },
    { x: CENTER_X + layout.waistWidth / 2, y: layout.waistY },
    { x: CENTER_X + layout.hipWidth / 2, y: layout.hipY },
    { x: CENTER_X - layout.hipWidth / 2, y: layout.hipY },
    { x: CENTER_X - layout.waistWidth / 2, y: layout.waistY },
  ];
}

export function buildLegPoints(layout: BodyLayout): Point[][] {
  const halfHipWidth = layout.hipWidth / 2;

  return [
    buildRectanglePoints(CENTER_X - halfHipWidth, layout.hipY, CENTER_X - LEG_GAP_PX, layout.feetY),
    buildRectanglePoints(CENTER_X + LEG_GAP_PX, layout.hipY, CENTER_X + halfHipWidth, layout.feetY),
  ];
}

export function buildShirtPoints(layout: BodyLayout, shirt: ShirtMeasurements): Point[] {
  const halfChestWidth = circumferenceToWidth(shirt.chestCm) / 2;
  const halfWaistWidth = circumferenceToWidth(shirt.waistCm) / 2;
  const bottomY = layout.chestY + toPixels(shirt.lengthCm);

  return [
    { x: CENTER_X - halfChestWidth, y: layout.chestY },
    { x: CENTER_X + halfChestWidth, y: layout.chestY },
    { x: CENTER_X + halfWaistWidth, y: bottomY },
    { x: CENTER_X - halfWaistWidth, y: bottomY },
  ];
}

export function buildPantsPoints(layout: BodyLayout, pants: PantsMeasurements): Point[] {
  const halfWaistWidth = circumferenceToWidth(pants.waistCm) / 2;
  const halfHipWidth = circumferenceToWidth(pants.hipCm) / 2;
  const bottomY = layout.waistY + toPixels(pants.lengthCm);

  return [
    { x: CENTER_X - halfWaistWidth, y: layout.waistY },
    { x: CENTER_X + halfWaistWidth, y: layout.waistY },
    { x: CENTER_X + halfHipWidth, y: layout.hipY },
    { x: CENTER_X + halfHipWidth, y: bottomY },
    { x: CENTER_X + LEG_GAP_PX, y: bottomY },
    { x: CENTER_X + LEG_GAP_PX, y: layout.crotchY },
    { x: CENTER_X - LEG_GAP_PX, y: layout.crotchY },
    { x: CENTER_X - LEG_GAP_PX, y: bottomY },
    { x: CENTER_X - halfHipWidth, y: bottomY },
    { x: CENTER_X - halfHipWidth, y: layout.hipY },
  ];
}
