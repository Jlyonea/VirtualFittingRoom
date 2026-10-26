import type { BodyMeasurements } from '../../types/avatar';
import type { Outfit } from '../../types/outfit';
import type { PantsMeasurements, ShirtMeasurements } from '../../types/product';

export const CENTIMETERS_PER_UNIT = 100;
export const GARMENT_THICKNESS = 0.005;
export const TORSO_DEPTH_RATIO = 0.75;

const HEAD_HEIGHT_RATIO = 0.13;
const CHEST_LINE_RATIO = 0.17;
const WAIST_LINE_RATIO = 0.38;
const HIP_LINE_RATIO = 0.48;
const NECK_WIDTH_RATIO = 0.3;
const LEG_GAP = 0.01;

export type Vector3Tuple = [number, number, number];

interface AvatarPartBase {
  id: string;
  position: Vector3Tuple;
  depthScale: number;
  color: string;
}

export interface SpherePart extends AvatarPartBase {
  shape: 'sphere';
  radius: number;
}

export interface CylinderPart extends AvatarPartBase {
  shape: 'cylinder';
  radiusTop: number;
  radiusBottom: number;
  height: number;
}

export type AvatarPart = SpherePart | CylinderPart;

export interface CylinderSpan {
  id: string;
  topY: number;
  bottomY: number;
  radiusTop: number;
  radiusBottom: number;
  color: string;
  x?: number;
  depthScale?: number;
}

export interface LegSpan {
  idPrefix: string;
  topY: number;
  bottomY: number;
  radius: number;
  offsetX: number;
  color: string;
}

export interface BodyLayout {
  height: number;
  headRadius: number;
  headCenterY: number;
  neckTopY: number;
  chestY: number;
  waistY: number;
  hipY: number;
  chestRadius: number;
  waistRadius: number;
  hipRadius: number;
}

export function toUnits(centimeters: number): number {
  return centimeters / CENTIMETERS_PER_UNIT;
}

export function circumferenceToRadius(circumferenceCm: number): number {
  return toUnits(circumferenceCm) / (2 * Math.PI);
}

function lineFromTop(height: number, ratio: number): number {
  return height * (1 - ratio);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateBodyLayout(measurements: BodyMeasurements): BodyLayout {
  const height = toUnits(measurements.heightCm);
  const headRadius = (height * HEAD_HEIGHT_RATIO) / 2;

  return {
	height,
	headRadius,
	headCenterY: height - headRadius,
	neckTopY: height - headRadius * 2,
	chestY: lineFromTop(height, CHEST_LINE_RATIO),
	waistY: lineFromTop(height, WAIST_LINE_RATIO),
	hipY: lineFromTop(height, HIP_LINE_RATIO),
	chestRadius: circumferenceToRadius(measurements.chestCm),
	waistRadius: circumferenceToRadius(measurements.waistCm),
	hipRadius: circumferenceToRadius(measurements.hipCm),
  };
}

export function buildCylinderPart({
  id,
  topY,
  bottomY,
  radiusTop,
  radiusBottom,
  color,
  x = 0,
  depthScale = 1,
}: CylinderSpan): CylinderPart {
  return {
	id,
	shape: 'cylinder',
	position: [x, (topY + bottomY) / 2, 0],
	radiusTop,
	radiusBottom,
	height: topY - bottomY,
	depthScale,
	color,
  };
}

export function buildLegParts({ idPrefix, topY, bottomY, radius, offsetX, color }: LegSpan): CylinderPart[] {
  return [-offsetX, offsetX].map((x, index) =>
	buildCylinderPart({
	  id: `${idPrefix}-${index === 0 ? 'left' : 'right'}`,
	  topY,
	  bottomY,
	  radiusTop: radius,
	  radiusBottom: radius,
	  color,
	  x,
	}),
  );
}

export function buildBodyParts(layout: BodyLayout, skinColor: string): AvatarPart[] {
  const neckRadius = layout.chestRadius * NECK_WIDTH_RATIO;

  return [
	{
	  id: 'head',
	  shape: 'sphere',
	  position: [0, layout.headCenterY, 0],
	  radius: layout.headRadius,
	  depthScale: 1,
	  color: skinColor,
	},
	buildCylinderPart({
	  id: 'neck',
	  topY: layout.neckTopY,
	  bottomY: layout.chestY,
	  radiusTop: neckRadius,
	  radiusBottom: neckRadius,
	  color: skinColor,
	}),
	buildCylinderPart({
	  id: 'chest',
	  topY: layout.chestY,
	  bottomY: layout.waistY,
	  radiusTop: layout.chestRadius,
	  radiusBottom: layout.waistRadius,
	  color: skinColor,
	  depthScale: TORSO_DEPTH_RATIO,
	}),
	buildCylinderPart({
	  id: 'abdomen',
	  topY: layout.waistY,
	  bottomY: layout.hipY,
	  radiusTop: layout.waistRadius,
	  radiusBottom: layout.hipRadius,
	  color: skinColor,
	  depthScale: TORSO_DEPTH_RATIO,
	}),
	...buildLegParts({
	  idPrefix: 'leg',
	  topY: layout.hipY,
	  bottomY: 0,
	  radius: layout.hipRadius / 2 - LEG_GAP,
	  offsetX: layout.hipRadius / 2,
	  color: skinColor,
	}),
  ];
}

export function buildShirtPart(layout: BodyLayout, shirt: ShirtMeasurements, color: string): CylinderPart {
  return buildCylinderPart({
	id: 'shirt',
	topY: layout.chestY,
	bottomY: clamp(layout.chestY - toUnits(shirt.lengthCm), 0, layout.chestY),
	radiusTop: circumferenceToRadius(shirt.chestCm) + GARMENT_THICKNESS,
	radiusBottom: circumferenceToRadius(shirt.waistCm) + GARMENT_THICKNESS,
	color,
	depthScale: TORSO_DEPTH_RATIO,
  });
}

export function buildPantsParts(layout: BodyLayout, pants: PantsMeasurements, color: string): CylinderPart[] {
  const hipRadius = circumferenceToRadius(pants.hipCm);

  return [
	buildCylinderPart({
	  id: 'pants-waist',
	  topY: layout.waistY,
	  bottomY: layout.hipY,
	  radiusTop: circumferenceToRadius(pants.waistCm) + GARMENT_THICKNESS,
	  radiusBottom: hipRadius + GARMENT_THICKNESS,
	  color,
	  depthScale: TORSO_DEPTH_RATIO,
	}),
	...buildLegParts({
	  idPrefix: 'pants-leg',
	  topY: layout.hipY,
	  bottomY: clamp(layout.waistY - toUnits(pants.lengthCm), 0, layout.hipY),
	  radius: hipRadius / 2 - LEG_GAP + GARMENT_THICKNESS,
	  offsetX: hipRadius / 2,
	  color,
	}),
  ];
}

export function buildAvatarParts(layout: BodyLayout, outfit: Outfit, skinColor: string): AvatarPart[] {
  return [
	...buildBodyParts(layout, skinColor),
	...(outfit.pants ? buildPantsParts(layout, outfit.pants.measurements, outfit.pants.color) : []),
	...(outfit.shirt ? [buildShirtPart(layout, outfit.shirt.measurements, outfit.shirt.color)] : []),
  ];
}
