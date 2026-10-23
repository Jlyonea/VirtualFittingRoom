export interface BodyMeasurements {
  heightCm: number;
  chestCm: number;
  waistCm: number;
  hipCm: number;
}

export interface Avatar {
  id: string;
  name: string;
  measurements: BodyMeasurements;
}
