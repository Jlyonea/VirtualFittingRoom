import { MeasurementForm } from '../../components/MeasurementForm/MeasurementForm';
import type { Avatar, BodyMeasurements } from '../../types/avatar';

interface AvatarPageProps {
  avatar: Avatar | null;
  onSaveMeasurements: (measurements: BodyMeasurements) => void;
}

export function AvatarPage({ avatar, onSaveMeasurements }: AvatarPageProps) {
  return (
    <section>
      <h1>My measurements</h1>
      {avatar ? (
        <MeasurementForm initialMeasurements={avatar.measurements} onSubmit={onSaveMeasurements} />
      ) : (
        <p>Loading avatar...</p>
      )}
    </section>
  );
}
