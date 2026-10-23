import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MeasurementForm } from '../../../src/components/MeasurementForm/MeasurementForm';
import { avatarFixture } from '../../fixtures/avatar';

describe('MeasurementForm', () => {
  it('render_WithInitialMeasurements_FillsInputs', () => {
    render(<MeasurementForm initialMeasurements={avatarFixture.measurements} onSubmit={vi.fn()} />);

    expect(screen.getByLabelText('Height (cm)')).toHaveValue(175);
    expect(screen.getByLabelText('Chest (cm)')).toHaveValue(98);
    expect(screen.getByLabelText('Waist (cm)')).toHaveValue(82);
    expect(screen.getByLabelText('Hip (cm)')).toHaveValue(98);
  });

  it('submit_AfterChangingHeight_CallsOnSubmitWithUpdatedMeasurements', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<MeasurementForm initialMeasurements={avatarFixture.measurements} onSubmit={handleSubmit} />);
    const heightInput = screen.getByLabelText('Height (cm)');

    await user.clear(heightInput);
    await user.type(heightInput, '180');
    await user.click(screen.getByRole('button', { name: 'Save measurements' }));

    expect(handleSubmit).toHaveBeenCalledWith({ ...avatarFixture.measurements, heightCm: 180 });
  });
});
