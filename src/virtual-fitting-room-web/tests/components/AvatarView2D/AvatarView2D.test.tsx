import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AvatarView2D } from '../../../src/components/AvatarView2D/AvatarView2D';
import { avatarFixture } from '../../fixtures/avatar';
import { pantsFixture, shirtFixture } from '../../fixtures/products';

describe('AvatarView2D', () => {
  it('render_WithEmptyOutfit_DrawsOnlyBody', () => {
    render(<AvatarView2D measurements={avatarFixture.measurements} outfit={{ shirt: null, pants: null }} />);

    expect(screen.getByRole('img', { name: 'Avatar preview' })).toBeInTheDocument();
    expect(screen.queryByTestId('shirt-layer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pants-layer')).not.toBeInTheDocument();
  });

  it('render_WithShirtAndPants_DrawsGarmentLayersWithProductColors', () => {
    render(
      <AvatarView2D measurements={avatarFixture.measurements} outfit={{ shirt: shirtFixture, pants: pantsFixture }} />,
    );

    expect(screen.getByTestId('shirt-layer')).toHaveAttribute('fill', shirtFixture.color);
    expect(screen.getByTestId('pants-layer')).toHaveAttribute('fill', pantsFixture.color);
  });
});
