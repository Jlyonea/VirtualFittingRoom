import { useState } from 'react';
import { Button } from './components/Button/Button';
import { useAvatar } from './hooks/useAvatar';
import { useOutfit } from './hooks/useOutfit';
import { AvatarPage } from './pages/AvatarPage/AvatarPage';
import { CatalogPage } from './pages/CatalogPage/CatalogPage';
import { FittingRoomPage } from './pages/FittingRoomPage/FittingRoomPage';
import styles from './App.module.css';

type PageKey = 'catalog' | 'avatar' | 'fittingRoom';

const NAVIGATION_ITEMS: { key: PageKey; label: string }[] = [
  { key: 'catalog', label: 'Catalog' },
  { key: 'avatar', label: 'My measurements' },
  { key: 'fittingRoom', label: 'Fitting room' },
];

export function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('catalog');
  const { avatar, saveMeasurements } = useAvatar();
  const { outfit, selectedProductIds, selectProduct, removeProduct } = useOutfit();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.brand}>Virtual Fitting Room</span>
        <nav aria-label="Main navigation">
          <ul className={styles.navigationList}>
            {NAVIGATION_ITEMS.map((item) => {
              const isCurrent = item.key === currentPage;

              return (
                <li key={item.key}>
                  <Button
                    variant={isCurrent ? 'primary' : 'secondary'}
                    aria-current={isCurrent ? 'page' : undefined}
                    onClick={() => setCurrentPage(item.key)}
                  >
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <main className={styles.main}>
        {currentPage === 'catalog' && (
          <CatalogPage selectedProductIds={selectedProductIds} onSelectProduct={selectProduct} />
        )}
        {currentPage === 'avatar' && <AvatarPage avatar={avatar} onSaveMeasurements={saveMeasurements} />}
        {currentPage === 'fittingRoom' && (
          <FittingRoomPage avatar={avatar} outfit={outfit} onRemoveProduct={removeProduct} />
        )}
      </main>
    </div>
  );
}
