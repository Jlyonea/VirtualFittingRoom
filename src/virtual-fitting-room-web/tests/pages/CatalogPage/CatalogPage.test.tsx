import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useProducts } from '../../../src/hooks/useProducts';
import { CatalogPage } from '../../../src/pages/CatalogPage/CatalogPage';
import type { Product } from '../../../src/types/product';
import { pantsFixture, shirtFixture } from '../../fixtures/products';

vi.mock('../../../src/hooks/useProducts', () => ({
  useProducts: vi.fn(),
}));

vi.mock('../../../src/components/ProductList/ProductList', () => ({
  ProductList: ({ products }: { products: Product[] }) => (
    <div data-testid="product-list">{products.map((product) => product.name).join(',')}</div>
  ),
}));

describe('CatalogPage', () => {
  it('render_WhileLoading_ShowsLoadingMessage', () => {
    vi.mocked(useProducts).mockReturnValue({ products: [], isLoading: true });

    render(<CatalogPage selectedProductIds={[]} onSelectProduct={vi.fn()} />);

    expect(screen.getByText('Loading products...')).toBeInTheDocument();
    expect(screen.queryByTestId('product-list')).not.toBeInTheDocument();
  });

  it('render_WhenLoaded_RendersProductListWithProducts', () => {
    vi.mocked(useProducts).mockReturnValue({ products: [shirtFixture, pantsFixture], isLoading: false });

    render(<CatalogPage selectedProductIds={[]} onSelectProduct={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Catalog' })).toBeInTheDocument();
    expect(screen.getByTestId('product-list')).toHaveTextContent('Test Shirt,Test Pants');
  });
});
