import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProductList } from '../../../src/components/ProductList/ProductList';
import type { Product } from '../../../src/types/product';
import { pantsFixture, shirtFixture } from '../../fixtures/products';

vi.mock('../../../src/components/ProductCard/ProductCard', () => ({
  ProductCard: ({ product, isSelected }: { product: Product; isSelected: boolean }) => (
    <div data-testid="product-card">
      {product.name}:{String(isSelected)}
    </div>
  ),
}));

describe('ProductList', () => {
  it('render_WithProducts_RendersOneCardPerProduct', () => {
    render(<ProductList products={[shirtFixture, pantsFixture]} selectedProductIds={[]} onSelect={vi.fn()} />);

    expect(screen.getAllByTestId('product-card')).toHaveLength(2);
  });

  it('render_WithSelectedId_MarksOnlyThatProductAsSelected', () => {
    render(
      <ProductList
        products={[shirtFixture, pantsFixture]}
        selectedProductIds={[shirtFixture.id]}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText('Test Shirt:true')).toBeInTheDocument();
    expect(screen.getByText('Test Pants:false')).toBeInTheDocument();
  });
});
