'use client';

import { useAppSelector } from '@/lib/hooks';
import styles from './Header.module.css';

export default function Header() {
  const { data } = useAppSelector((state) => state.search);

  if (!data || !data.context) {
    return null;
  }

  const pointFrom = data.context.search.pointFrom.title;
  const pointTo = data.context.search.pointTo.title;
  const minPrice = data.minPrice?.forward;

  return (
    <div className={styles.header}>
      <h2 className={styles.headerTitle}>Route Information</h2>
      <div className={styles.headerContent}>
        <div>
          <strong>From:</strong> {pointFrom}
        </div>
        <div>
          <strong>To:</strong> {pointTo}
        </div>
        {minPrice && (
          <div>
            <strong>Min Price:</strong> {minPrice.value.toLocaleString()}{' '}
            {minPrice.currency}
          </div>
        )}
      </div>
    </div>
  );
}
