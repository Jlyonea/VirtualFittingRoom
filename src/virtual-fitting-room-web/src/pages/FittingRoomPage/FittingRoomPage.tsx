import { AvatarView3D } from '../../components/AvatarView3D/AvatarView3D';
import { OutfitSummary } from '../../components/OutfitSummary/OutfitSummary';
import type { Avatar } from '../../types/avatar';
import type { Outfit } from '../../types/outfit';
import type { ProductCategory } from '../../types/product';
import styles from './FittingRoomPage.module.css';

interface FittingRoomPageProps {
  avatar: Avatar | null;
  outfit: Outfit;
  onRemoveProduct: (category: ProductCategory) => void;
}

export function FittingRoomPage({ avatar, outfit, onRemoveProduct }: FittingRoomPageProps) {
  return (
    <section>
      <h1>Fitting room</h1>
      {avatar ? (
        <div className={styles.layout}>
          <AvatarView3D measurements={avatar.measurements} outfit={outfit} />
          <OutfitSummary outfit={outfit} onRemove={onRemoveProduct} />
        </div>
      ) : (
        <p>Loading avatar...</p>
      )}
    </section>
  );
}
