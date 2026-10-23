import type { Pants, Shirt } from '../../src/types/product';

export const shirtFixture: Shirt = {
  id: 'shirt-test',
  name: 'Test Shirt',
  category: 'shirt',
  size: 'M',
  color: '#ff0000',
  measurements: { chestCm: 100, waistCm: 96, lengthCm: 70 },
};

export const pantsFixture: Pants = {
  id: 'pants-test',
  name: 'Test Pants',
  category: 'pants',
  size: '40',
  color: '#0000ff',
  measurements: { waistCm: 82, hipCm: 100, lengthCm: 102 },
};
