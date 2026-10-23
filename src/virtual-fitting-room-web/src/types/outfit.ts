import type { Pants, Shirt } from './product';

export interface Outfit {
  shirt: Shirt | null;
  pants: Pants | null;
}
