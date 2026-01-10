import { formatPrice } from '@/utils/priceUtils';
import styles from './SegmentActions.module.css';

interface SegmentActionsProps {
  segmentMinPrice: { value: number; currency: string } | null;
  onSelectSeat?: () => void;
  className?: string;
}

export default function SegmentActions({ 
  segmentMinPrice, 
  onSelectSeat,
  className 
}: SegmentActionsProps) {
  if (!segmentMinPrice) {
    return null;
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.minPrice}>
        от {formatPrice(segmentMinPrice)}
      </div>
      <button 
        className={styles.selectButton}
        onClick={onSelectSeat}
      >
        Выбрать место
      </button>
    </div>
  );
}