import { AvatarView2D } from '../../components/AvatarView2D/AvatarView2D';
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
          <AvatarView2D measurements={avatar.measurements} outfit={outfit} />
          <OutfitSummary outfit={outfit} onRemove={onRemoveProduct} />
        </div>
      ) : (
        <p>Loading avatar...</p>
      )}
    </section>
  );
}
