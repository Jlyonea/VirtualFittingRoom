import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProductCard } from '../../../src/components/ProductCard/ProductCard';
import { shirtFixture } from '../../fixtures/products';

describe('ProductCard', () => {
  it('render_WithShirt_ShowsNameSizeAndMeasurements', () => {
    render(<ProductCard product={shirtFixture} isSelected={false} onSelect={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Test Shirt' })).toBeInTheDocument();
    expect(screen.getByText('Size M')).toBeInTheDocument();
    expect(screen.getByText('Chest: 100 cm')).toBeInTheDocument();
    expect(screen.getByText('Waist: 96 cm')).toBeInTheDocument();
    expect(screen.getByText('Length: 70 cm')).toBeInTheDocument();
  });

  it('click_WhenNotSelected_CallsOnSelectWithProduct', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<ProductCard product={shirtFixture} isSelected={false} onSelect={handleSelect} />);

    await user.click(screen.getByRole('button', { name: 'Add to outfit' }));

    expect(handleSelect).toHaveBeenCalledWith(shirtFixture);
  });

  it('render_WhenSelected_ShowsDisabledSelectedButton', () => {
    render(<ProductCard product={shirtFixture} isSelected onSelect={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Selected' })).toBeDisabled();
  });
});
