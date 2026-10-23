import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import type { Product } from '../types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    productService.getAll().then((result) => {
      if (isActive) {
        setProducts(result);
        setIsLoading(false);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  return { products, isLoading };
}
