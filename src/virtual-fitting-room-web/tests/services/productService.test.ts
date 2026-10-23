import { describe, expect, it } from 'vitest';
import productsData from '../../src/mocks/products.json';
import { productService } from '../../src/services/productService';

describe('productService', () => {
  it('getAll_WhenCalled_ReturnsAllMockProducts', async () => {
    const products = await productService.getAll();

    expect(products).toEqual(productsData);
  });
});
