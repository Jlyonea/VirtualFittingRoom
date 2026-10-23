import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '../Button/Button';
import { MEASUREMENT_LABELS } from '../../constants/measurementLabels';
import type { BodyMeasurements } from '../../types/avatar';
import styles from './MeasurementForm.module.css';

const FIELD_KEYS: (keyof BodyMeasurements)[] = ['heightCm', 'chestCm', 'waistCm', 'hipCm'];

type MeasurementFormValues = Record<keyof BodyMeasurements, string>;

function toFormValues(measurements: BodyMeasurements): MeasurementFormValues {
  return {
    heightCm: String(measurements.heightCm),
    chestCm: String(measurements.chestCm),
    waistCm: String(measurements.waistCm),
    hipCm: String(measurements.hipCm),
  };
}

function toMeasurements(values: MeasurementFormValues): BodyMeasurements {
  return {
    heightCm: Number(values.heightCm),
    chestCm: Number(values.chestCm),
    waistCm: Number(values.waistCm),
    hipCm: Number(values.hipCm),
  };
}

interface MeasurementFormProps {
  initialMeasurements: BodyMeasurements;
  onSubmit: (measurements: BodyMeasurements) => void;
}

export function MeasurementForm({ initialMeasurements, onSubmit }: MeasurementFormProps) {
  const [values, setValues] = useState<MeasurementFormValues>(() => toFormValues(initialMeasurements));

  const handleChange = (key: keyof BodyMeasurements) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(toMeasurements(values));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {FIELD_KEYS.map((key) => (
        <label key={key} className={styles.field}>
          <span>{MEASUREMENT_LABELS[key]} (cm)</span>
          <input
            className={styles.input}
            type="number"
            min={1}
            step={0.5}
            required
            value={values[key]}
            onChange={handleChange(key)}
          />
        </label>
      ))}
      <Button type="submit">Save measurements</Button>
    </form>
  );
}
