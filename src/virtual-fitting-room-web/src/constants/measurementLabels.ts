import type { BodyMeasurements } from '../types/avatar';
import type { PantsMeasurements, ShirtMeasurements } from '../types/product';

export type MeasurementKey = keyof BodyMeasurements | keyof ShirtMeasurements | keyof PantsMeasurements;

export const MEASUREMENT_LABELS: Record<MeasurementKey, string> = {
  heightCm: 'Height',
  chestCm: 'Chest',
  waistCm: 'Waist',
  hipCm: 'Hip',
  lengthCm: 'Length',
};
