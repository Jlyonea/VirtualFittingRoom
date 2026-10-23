import { Button } from '../Button/Button';
import { MEASUREMENT_LABELS, type MeasurementKey } from '../../constants/measurementLabels';
import type { Product } from '../../types/product';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, isSelected, onSelect }: ProductCardProps) {
  const measurementEntries = Object.entries(product.measurements) as [MeasurementKey, number][];

  return (
    <article className={styles.card}>
      <div className={styles.swatch} style={{ backgroundColor: product.color }} aria-hidden="true" />
      <h3 className={styles.name}>{product.name}</h3>
      <p className={styles.size}>Size {product.size}</p>
      <ul className={styles.measurements}>
        {measurementEntries.map(([key, value]) => (
          <li key={key}>
            {MEASUREMENT_LABELS[key]}: {value} cm
          </li>
        ))}
      </ul>
      <Button variant={isSelected ? 'secondary' : 'primary'} disabled={isSelected} onClick={() => onSelect(product)}>
        {isSelected ? 'Selected' : 'Add to outfit'}
      </Button>
    </article>
  );
}
