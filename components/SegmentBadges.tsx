import styles from './Segment.module.css';

interface SegmentBadgesProps {
  hasNonRefundableTariff: boolean;
  isCheapestSegment: boolean;
  isFastestSegment: boolean;
}

export default function SegmentBadges({
  hasNonRefundableTariff,
  isCheapestSegment,
  isFastestSegment,
}: SegmentBadgesProps) {
  return (
    <div className={styles.badgesContainer}>
      {hasNonRefundableTariff && (
        <div className={styles.nonRefundableBadge}>
          есть скидка на невозвратный тариф
        </div>
      )}
      {isCheapestSegment && (
        <div className={styles.cheapestBadge}>самый дешевый</div>
      )}
      {isFastestSegment && (
        <div className={styles.fastestBadge}>самый быстрый</div>
      )}
    </div>
  );
}