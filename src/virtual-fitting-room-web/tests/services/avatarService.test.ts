import { beforeEach, describe, expect, it, vi } from 'vitest';
import avatarData from '../../src/mocks/avatar.json';
import { avatarFixture } from '../fixtures/avatar';

async function loadAvatarService() {
  const serviceModule = await import('../../src/services/avatarService');

  return serviceModule.avatarService;
}

describe('avatarService', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('get_WhenNothingWasSaved_ReturnsMockAvatar', async () => {
    const avatarService = await loadAvatarService();

    await expect(avatarService.get()).resolves.toEqual(avatarData);
  });

  it('save_WithAvatar_ReturnsSavedAvatar', async () => {
    const avatarService = await loadAvatarService();

    await expect(avatarService.save(avatarFixture)).resolves.toEqual(avatarFixture);
  });

  it('get_AfterSave_ReturnsSavedAvatar', async () => {
    const avatarService = await loadAvatarService();

    await avatarService.save(avatarFixture);

    await expect(avatarService.get()).resolves.toEqual(avatarFixture);
  });
});
