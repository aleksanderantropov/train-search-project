import type { SearchResponse } from '@/lib/slices/searchSlice';
import { formatDateHeader } from '@/utils/dateUtils';
import Segment from './Segment';
import styles from './SegmentGroup.module.css';

interface SegmentGroupProps {
  segments: SearchResponse['variants'][0]['forward'];
  title?: string;
  firstNextDaySegmentId: string | null;
  globalMinPrice?: { value: number; currency: string } | null;
  minDuration?: number | null;
}

export default function SegmentGroup({ 
  segments, 
  title, 
  firstNextDaySegmentId,
  globalMinPrice,
  minDuration
}: SegmentGroupProps) {
  return (
    <>
      {segments.map((segment, segmentIndex) => (
        <div key={segment.id}>
          {segment.id === firstNextDaySegmentId && (
            <div className={styles.dateHeader}>
              {formatDateHeader(segment.departure)}
            </div>
          )}
          <div className={styles.segmentContainer}>
            {title && segments.length > 1 && (
              <h3 className={styles.segmentTitle}>
                {title} {segmentIndex + 1}
              </h3>
            )}
            <Segment 
              segment={segment}
              globalMinPrice={globalMinPrice}
              minDuration={minDuration}
            />
          </div>
        </div>
      ))}
    </>
  );
}