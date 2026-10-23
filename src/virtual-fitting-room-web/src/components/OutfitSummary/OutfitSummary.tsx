import { Button } from '../Button/Button';
import type { Outfit } from '../../types/outfit';
import type { ProductCategory } from '../../types/product';
import styles from './OutfitSummary.module.css';

const CATEGORIES: ProductCategory[] = ['shirt', 'pants'];

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  shirt: 'Shirt',
  pants: 'Pants',
};

interface OutfitSummaryProps {
  outfit: Outfit;
  onRemove: (category: ProductCategory) => void;
}

export function OutfitSummary({ outfit, onRemove }: OutfitSummaryProps) {
  return (
    <section className={styles.summary} aria-label="Outfit summary">
      <h2 className={styles.title}>Your outfit</h2>
      <ul className={styles.list}>
        {CATEGORIES.map((category) => {
          const product = outfit[category];
          const label = CATEGORY_LABELS[category];

          return (
            <li key={category} className={styles.item}>
              <span>
                {label}: {product ? `${product.name} (${product.size})` : 'none'}
              </span>
              {product && (
                <Button variant="secondary" aria-label={`Remove ${label}`} onClick={() => onRemove(category)}>
                  Remove
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
