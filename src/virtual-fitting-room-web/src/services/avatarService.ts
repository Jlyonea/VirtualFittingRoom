import avatarData from '../mocks/avatar.json';
import type { Avatar } from '../types/avatar';

let currentAvatar: Avatar = avatarData;

export const avatarService = {
  get(): Promise<Avatar> {
    return Promise.resolve(currentAvatar);
  },

  save(avatar: Avatar): Promise<Avatar> {
    currentAvatar = avatar;
    return Promise.resolve(currentAvatar);
  },
};
