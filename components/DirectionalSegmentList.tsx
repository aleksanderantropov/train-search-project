import { useMemo } from 'react';
import type { SearchResponse } from '@/lib/slices/searchSlice';
import { calculateDirectionalData, extractDirectionalSegments } from '@/utils/segmentUtils';
import SegmentGroup from './SegmentGroup';
import styles from './DirectionalSegmentList.module.css';

interface DirectionalSegmentListProps {
  variants: SearchResponse['variants'];
  direction: 'forward' | 'backward';
  className?: string;
}

export default function DirectionalSegmentList({ 
  variants, 
  direction, 
  className 
}: DirectionalSegmentListProps) {
  const directionalData = useMemo(() => {
    const segments = extractDirectionalSegments(variants, direction);
    return calculateDirectionalData(segments);
  }, [variants, direction]);

  // Group segments back by variant for proper display
  const variantSegments = useMemo(() => {
    return variants
      .map((variant) => {
        const segments = direction === 'forward' ? variant.forward : variant.backward;
        return segments ? { variantId: variant.id, segments } : null;
      })
      .filter(Boolean) as Array<{ variantId: string; segments: any[] }>;
  }, [variants, direction]);

  if (variantSegments.length === 0) {
    return (
      <div className={`${styles.empty} ${className || ''}`}>
        <p>No {direction} segments available</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.summary}>
        <p><strong>Segments:</strong> {directionalData.segments.length}</p>
        {directionalData.minPrice && (
          <p><strong>Best Price:</strong> от {directionalData.minPrice.value.toLocaleString()} {directionalData.minPrice.currency === 'RUB' ? '₽' : directionalData.minPrice.currency}</p>
        )}
        {directionalData.minDuration && (
          <p><strong>Shortest Duration:</strong> {Math.floor(directionalData.minDuration / 3600)}h {Math.floor((directionalData.minDuration % 3600) / 60)}m</p>
        )}
      </div>

      {variantSegments.map(({ variantId, segments }) => (
        <div key={`${direction}-${variantId}`} className={styles.variantContainer}>
          <SegmentGroup
            segments={segments}
            title={segments.length > 1 ? `${direction.charAt(0).toUpperCase() + direction.slice(1)} Segment` : undefined}
            firstNextDaySegmentId={directionalData.firstNextDaySegmentId}
            globalMinPrice={directionalData.minPrice}
            minDuration={directionalData.minDuration}
          />
        </div>
      ))}
    </div>
  );
}