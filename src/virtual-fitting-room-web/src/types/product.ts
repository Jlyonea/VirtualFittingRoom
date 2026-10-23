interface ProductBase {
  id: string;
  name: string;
  size: string;
  color: string;
}

export interface ShirtMeasurements {
  chestCm: number;
  waistCm: number;
  lengthCm: number;
}

export interface PantsMeasurements {
  waistCm: number;
  hipCm: number;
  lengthCm: number;
}

export interface Shirt extends ProductBase {
  category: 'shirt';
  measurements: ShirtMeasurements;
}

export interface Pants extends ProductBase {
  category: 'pants';
  measurements: PantsMeasurements;
}

export type Product = Shirt | Pants;

export type ProductCategory = Product['category'];
