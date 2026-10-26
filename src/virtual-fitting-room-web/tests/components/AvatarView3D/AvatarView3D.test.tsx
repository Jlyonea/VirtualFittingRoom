import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AvatarView3D } from '../../../src/components/AvatarView3D/AvatarView3D';
import { avatarFixture } from '../../fixtures/avatar';
import { pantsFixture, shirtFixture } from '../../fixtures/products';

vi.mock('@react-three/fiber', () => ({
  Canvas: () => <div data-testid="avatar-canvas" />,
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
}));

describe('AvatarView3D', () => {
  it('render_WithEmptyOutfit_ShowsAvatarPreviewCanvas', () => {
	render(<AvatarView3D measurements={avatarFixture.measurements} outfit={{ shirt: null, pants: null }} />);

	expect(screen.getByRole('img', { name: 'Avatar preview' })).toBeInTheDocument();
	expect(screen.getByTestId('avatar-canvas')).toBeInTheDocument();
  });

  it('render_WithShirtAndPants_ShowsAvatarPreviewCanvas', () => {
	render(
	  <AvatarView3D measurements={avatarFixture.measurements} outfit={{ shirt: shirtFixture, pants: pantsFixture }} />,
	);

	expect(screen.getByRole('img', { name: 'Avatar preview' })).toBeInTheDocument();
	expect(screen.getByTestId('avatar-canvas')).toBeInTheDocument();
  });
});
