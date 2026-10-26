import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FittingRoomPage } from '../../../src/pages/FittingRoomPage/FittingRoomPage';
import type { ProductCategory } from '../../../src/types/product';
import { avatarFixture } from '../../fixtures/avatar';

vi.mock('../../../src/components/AvatarView3D/AvatarView3D', () => ({
  AvatarView3D: () => <div data-testid="avatar-view" />,
}));

vi.mock('../../../src/components/OutfitSummary/OutfitSummary', () => ({
  OutfitSummary: ({ onRemove }: { onRemove: (category: ProductCategory) => void }) => (
    <button onClick={() => onRemove('shirt')}>Mock remove</button>
  ),
}));

const emptyOutfit = { shirt: null, pants: null };

describe('FittingRoomPage', () => {
  it('render_WithoutAvatar_ShowsLoadingMessage', () => {
    render(<FittingRoomPage avatar={null} outfit={emptyOutfit} onRemoveProduct={vi.fn()} />);

    expect(screen.getByText('Loading avatar...')).toBeInTheDocument();
    expect(screen.queryByTestId('avatar-view')).not.toBeInTheDocument();
  });

  it('render_WithAvatar_ShowsAvatarViewAndOutfitSummary', () => {
    render(<FittingRoomPage avatar={avatarFixture} outfit={emptyOutfit} onRemoveProduct={vi.fn()} />);

    expect(screen.getByTestId('avatar-view')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mock remove' })).toBeInTheDocument();
  });

  it('remove_FromOutfitSummary_CallsOnRemoveProduct', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    render(<FittingRoomPage avatar={avatarFixture} outfit={emptyOutfit} onRemoveProduct={handleRemove} />);

    await user.click(screen.getByRole('button', { name: 'Mock remove' }));

    expect(handleRemove).toHaveBeenCalledWith('shirt');
  });
});
