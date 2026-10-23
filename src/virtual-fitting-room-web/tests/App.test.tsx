import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';

vi.mock('../src/hooks/useAvatar', () => ({
  useAvatar: () => ({ avatar: null, saveMeasurements: vi.fn() }),
}));

vi.mock('../src/hooks/useOutfit', () => ({
  useOutfit: () => ({
    outfit: { shirt: null, pants: null },
    selectedProductIds: [],
    selectProduct: vi.fn(),
    removeProduct: vi.fn(),
  }),
}));

vi.mock('../src/pages/CatalogPage/CatalogPage', () => ({
  CatalogPage: () => <div>Catalog page content</div>,
}));

vi.mock('../src/pages/AvatarPage/AvatarPage', () => ({
  AvatarPage: () => <div>Avatar page content</div>,
}));

vi.mock('../src/pages/FittingRoomPage/FittingRoomPage', () => ({
  FittingRoomPage: () => <div>Fitting room page content</div>,
}));

describe('App', () => {
  it('render_ByDefault_ShowsCatalogPage', () => {
    render(<App />);

    expect(screen.getByText('Catalog page content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Catalog' })).toHaveAttribute('aria-current', 'page');
  });

  it('clickNavigation_OnMyMeasurements_ShowsAvatarPage', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'My measurements' }));

    expect(screen.getByText('Avatar page content')).toBeInTheDocument();
    expect(screen.queryByText('Catalog page content')).not.toBeInTheDocument();
  });

  it('clickNavigation_OnFittingRoom_ShowsFittingRoomPage', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Fitting room' }));

    expect(screen.getByText('Fitting room page content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fitting room' })).toHaveAttribute('aria-current', 'page');
  });
});
