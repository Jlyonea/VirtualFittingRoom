import { describe, expect, it } from 'vitest';
import {
  CENTIMETERS_PER_UNIT,
  GARMENT_THICKNESS,
  TORSO_DEPTH_RATIO,
  buildAvatarParts,
  buildBodyParts,
  buildCylinderPart,
  buildLegParts,
  buildPantsParts,
  buildShirtPart,
  calculateBodyLayout,
  circumferenceToRadius,
  toUnits,
} from '../../../src/components/AvatarView3D/avatarGeometry';
import { avatarFixture } from '../../fixtures/avatar';
import { pantsFixture, shirtFixture } from '../../fixtures/products';

const layout = calculateBodyLayout(avatarFixture.measurements);
const skinColor = '#e8c4a8';

describe('avatarGeometry', () => {
  it('toUnits_WithCentimeters_ReturnsScaledValue', () => {
	expect(toUnits(150)).toBe(150 / CENTIMETERS_PER_UNIT);
  });

  it('circumferenceToRadius_WithCircumference_ReturnsRadiusInUnits', () => {
	expect(circumferenceToRadius(100)).toBeCloseTo(toUnits(100) / (2 * Math.PI));
  });

  it('calculateBodyLayout_WithMeasurements_PlacesHeadTopAtBodyHeight', () => {
	expect(layout.headCenterY + layout.headRadius).toBeCloseTo(toUnits(avatarFixture.measurements.heightCm));
  });

  it('calculateBodyLayout_WithMeasurements_OrdersBodyLinesFromTopToBottom', () => {
	const lines = [layout.height, layout.neckTopY, layout.chestY, layout.waistY, layout.hipY, 0];

	expect([...lines].sort((first, second) => second - first)).toEqual(lines);
  });

  it('calculateBodyLayout_WithMeasurements_ConvertsCircumferencesToRadii', () => {
	expect(layout.chestRadius).toBeCloseTo(circumferenceToRadius(avatarFixture.measurements.chestCm));
	expect(layout.waistRadius).toBeCloseTo(circumferenceToRadius(avatarFixture.measurements.waistCm));
	expect(layout.hipRadius).toBeCloseTo(circumferenceToRadius(avatarFixture.measurements.hipCm));
  });

  it('buildCylinderPart_WithSpan_CentersPartBetweenTopAndBottom', () => {
	const part = buildCylinderPart({ id: 'test', topY: 2, bottomY: 1, radiusTop: 0.3, radiusBottom: 0.2, color: '#000' });

	expect(part.position).toEqual([0, 1.5, 0]);
	expect(part.height).toBe(1);
	expect(part.depthScale).toBe(1);
  });

  it('buildLegParts_WithOffset_ReturnsMirroredLegs', () => {
	const legs = buildLegParts({ idPrefix: 'leg', topY: 1, bottomY: 0, radius: 0.1, offsetX: 0.2, color: '#000' });

	expect(legs.map((leg) => leg.id)).toEqual(['leg-left', 'leg-right']);
	expect(legs[0].position[0]).toBe(-0.2);
	expect(legs[1].position[0]).toBe(0.2);
  });

  it('buildBodyParts_WithLayout_UsesSkinColorForAllParts', () => {
	const parts = buildBodyParts(layout, skinColor);

	expect(parts.map((part) => part.id)).toEqual(['head', 'neck', 'chest', 'abdomen', 'leg-left', 'leg-right']);
	parts.forEach((part) => expect(part.color).toBe(skinColor));
  });

  it('buildShirtPart_WithShirtMeasurements_UsesShirtChestAndLength', () => {
	const part = buildShirtPart(layout, shirtFixture.measurements, shirtFixture.color);

	expect(part.radiusTop).toBeCloseTo(circumferenceToRadius(shirtFixture.measurements.chestCm) + GARMENT_THICKNESS);
	expect(part.height).toBeCloseTo(toUnits(shirtFixture.measurements.lengthCm));
	expect(part.depthScale).toBe(TORSO_DEPTH_RATIO);
  });

  it('buildPantsParts_WithPantsMeasurements_StartsAtWaistAndEndsAtPantsLength', () => {
	const [waist, leftLeg, rightLeg] = buildPantsParts(layout, pantsFixture.measurements, pantsFixture.color);
	const expectedBottomY = layout.waistY - toUnits(pantsFixture.measurements.lengthCm);

	expect(waist.position[1] + waist.height / 2).toBeCloseTo(layout.waistY);
	expect(waist.radiusTop).toBeCloseTo(circumferenceToRadius(pantsFixture.measurements.waistCm) + GARMENT_THICKNESS);
	[leftLeg, rightLeg].forEach((leg) => expect(leg.position[1] - leg.height / 2).toBeCloseTo(expectedBottomY));
  });

  it('buildAvatarParts_WithEmptyOutfit_ReturnsOnlyBodyParts', () => {
	const parts = buildAvatarParts(layout, { shirt: null, pants: null }, skinColor);

	expect(parts).toEqual(buildBodyParts(layout, skinColor));
  });

  it('buildAvatarParts_WithShirtAndPants_AddsGarmentPartsWithProductColors', () => {
	const parts = buildAvatarParts(layout, { shirt: shirtFixture, pants: pantsFixture }, skinColor);

	expect(parts.find((part) => part.id === 'shirt')?.color).toBe(shirtFixture.color);
	expect(parts.filter((part) => part.id.startsWith('pants-')).map((part) => part.color)).toEqual([
	  pantsFixture.color,
	  pantsFixture.color,
	  pantsFixture.color,
	]);
  });
});
