import productsData from '../mocks/products.json';
import type { Product } from '../types/product';

const products = productsData as Product[];

export const productService = {
  getAll(): Promise<Product[]> {
    return Promise.resolve(products);
  },
};
