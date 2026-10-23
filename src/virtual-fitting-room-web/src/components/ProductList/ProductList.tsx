import { ProductCard } from '../ProductCard/ProductCard';
import type { Product } from '../../types/product';
import styles from './ProductList.module.css';

interface ProductListProps {
  products: Product[];
  selectedProductIds: string[];
  onSelect: (product: Product) => void;
}

export function ProductList({ products, selectedProductIds, onSelect }: ProductListProps) {
  return (
    <ul className={styles.list}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            isSelected={selectedProductIds.includes(product.id)}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}
