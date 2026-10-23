import { ProductList } from '../../components/ProductList/ProductList';
import { useProducts } from '../../hooks/useProducts';
import type { Product } from '../../types/product';

interface CatalogPageProps {
  selectedProductIds: string[];
  onSelectProduct: (product: Product) => void;
}

export function CatalogPage({ selectedProductIds, onSelectProduct }: CatalogPageProps) {
  const { products, isLoading } = useProducts();

  return (
    <section>
      <h1>Catalog</h1>
      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <ProductList products={products} selectedProductIds={selectedProductIds} onSelect={onSelectProduct} />
      )}
    </section>
  );
}
