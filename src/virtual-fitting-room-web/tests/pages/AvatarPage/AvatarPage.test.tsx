import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AvatarPage } from '../../../src/pages/AvatarPage/AvatarPage';
import type { BodyMeasurements } from '../../../src/types/avatar';
import { avatarFixture } from '../../fixtures/avatar';

vi.mock('../../../src/components/MeasurementForm/MeasurementForm', () => ({
  MeasurementForm: ({
    initialMeasurements,
    onSubmit,
  }: {
    initialMeasurements: BodyMeasurements;
    onSubmit: (measurements: BodyMeasurements) => void;
  }) => <button onClick={() => onSubmit(initialMeasurements)}>Mock submit</button>,
}));

describe('AvatarPage', () => {
  it('render_WithoutAvatar_ShowsLoadingMessage', () => {
    render(<AvatarPage avatar={null} onSaveMeasurements={vi.fn()} />);

    expect(screen.getByText('Loading avatar...')).toBeInTheDocument();
  });

  it('submit_WithAvatar_CallsOnSaveMeasurements', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();
    render(<AvatarPage avatar={avatarFixture} onSaveMeasurements={handleSave} />);

    await user.click(screen.getByRole('button', { name: 'Mock submit' }));

    expect(handleSave).toHaveBeenCalledWith(avatarFixture.measurements);
  });
});
