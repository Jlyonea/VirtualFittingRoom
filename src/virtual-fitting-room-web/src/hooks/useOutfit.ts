import { useCallback, useMemo, useState } from 'react';
import type { Outfit } from '../types/outfit';
import type { Product, ProductCategory } from '../types/product';

const EMPTY_OUTFIT: Outfit = { shirt: null, pants: null };

function addProduct(outfit: Outfit, product: Product): Outfit {
  return product.category === 'shirt' ? { ...outfit, shirt: product } : { ...outfit, pants: product };
}

function removeCategory(outfit: Outfit, category: ProductCategory): Outfit {
  return category === 'shirt' ? { ...outfit, shirt: null } : { ...outfit, pants: null };
}

function getSelectedProductIds(outfit: Outfit): string[] {
  return [outfit.shirt, outfit.pants].flatMap((product) => (product ? [product.id] : []));
}

export function useOutfit() {
  const [outfit, setOutfit] = useState<Outfit>(EMPTY_OUTFIT);

  const selectProduct = useCallback((product: Product) => {
    setOutfit((current) => addProduct(current, product));
  }, []);

  const removeProduct = useCallback((category: ProductCategory) => {
    setOutfit((current) => removeCategory(current, category));
  }, []);

  const selectedProductIds = useMemo(() => getSelectedProductIds(outfit), [outfit]);

  return { outfit, selectedProductIds, selectProduct, removeProduct };
}
