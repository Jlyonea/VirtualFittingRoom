import { useCallback, useEffect, useState } from 'react';
import { avatarService } from '../services/avatarService';
import type { Avatar, BodyMeasurements } from '../types/avatar';

export function useAvatar() {
  const [avatar, setAvatar] = useState<Avatar | null>(null);

  useEffect(() => {
    let isActive = true;

    avatarService.get().then((result) => {
      if (isActive) {
        setAvatar(result);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  const saveMeasurements = useCallback(
    async (measurements: BodyMeasurements) => {
      if (!avatar) {
        return;
      }

      const savedAvatar = await avatarService.save({ ...avatar, measurements });
      setAvatar(savedAvatar);
    },
    [avatar],
  );

  return { avatar, saveMeasurements };
}
