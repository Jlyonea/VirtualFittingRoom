import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OutfitSummary } from '../../../src/components/OutfitSummary/OutfitSummary';
import { shirtFixture } from '../../fixtures/products';

describe('OutfitSummary', () => {
  it('render_WithEmptyOutfit_ShowsNoneForEachCategory', () => {
    render(<OutfitSummary outfit={{ shirt: null, pants: null }} onRemove={vi.fn()} />);

    expect(screen.getByText('Shirt: none')).toBeInTheDocument();
    expect(screen.getByText('Pants: none')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('render_WithShirt_ShowsShirtNameAndSize', () => {
    render(<OutfitSummary outfit={{ shirt: shirtFixture, pants: null }} onRemove={vi.fn()} />);

    expect(screen.getByText('Shirt: Test Shirt (M)')).toBeInTheDocument();
  });

  it('clickRemove_WithShirt_CallsOnRemoveWithShirtCategory', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    render(<OutfitSummary outfit={{ shirt: shirtFixture, pants: null }} onRemove={handleRemove} />);

    await user.click(screen.getByRole('button', { name: 'Remove Shirt' }));

    expect(handleRemove).toHaveBeenCalledWith('shirt');
  });
});
