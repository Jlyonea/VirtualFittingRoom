import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAvatar } from '../../src/hooks/useAvatar';
import { avatarService } from '../../src/services/avatarService';
import type { Avatar, BodyMeasurements } from '../../src/types/avatar';
import { avatarFixture } from '../fixtures/avatar';

vi.mock('../../src/services/avatarService', () => ({
  avatarService: { get: vi.fn(), save: vi.fn() },
}));

const newMeasurements: BodyMeasurements = { heightCm: 180, chestCm: 102, waistCm: 86, hipCm: 100 };

describe('useAvatar', () => {
  beforeEach(() => {
    vi.mocked(avatarService.get).mockReset().mockResolvedValue(avatarFixture);
    vi.mocked(avatarService.save).mockReset().mockImplementation((avatar: Avatar) => Promise.resolve(avatar));
  });

  it('useAvatar_AfterServiceResolves_ReturnsAvatar', async () => {
    const { result } = renderHook(() => useAvatar());

    await waitFor(() => expect(result.current.avatar).toEqual(avatarFixture));
  });

  it('saveMeasurements_WithLoadedAvatar_SavesAndUpdatesAvatar', async () => {
    const { result } = renderHook(() => useAvatar());
    await waitFor(() => expect(result.current.avatar).not.toBeNull());

    await act(async () => {
      await result.current.saveMeasurements(newMeasurements);
    });

    expect(avatarService.save).toHaveBeenCalledWith({ ...avatarFixture, measurements: newMeasurements });
    expect(result.current.avatar?.measurements).toEqual(newMeasurements);
  });

  it('saveMeasurements_WithoutLoadedAvatar_DoesNotCallService', async () => {
    vi.mocked(avatarService.get).mockReturnValue(new Promise<Avatar>(() => {}));
    const { result } = renderHook(() => useAvatar());

    await act(async () => {
      await result.current.saveMeasurements(newMeasurements);
    });

    expect(avatarService.save).not.toHaveBeenCalled();
  });
});
