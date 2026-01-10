import type { SearchResponse } from '@/lib/slices/searchSlice';
import styles from './Segment.module.css';

interface SegmentTrainInfoProps {
  segment: SearchResponse['variants'][0]['forward'][0];
}

export default function SegmentTrainInfo({ segment }: SegmentTrainInfoProps) {
  return (
    <div className={styles.trainInfo}>
      <div className={styles.trainNumber}>
        {segment.train.displayNumber}
      </div>
      <div className={styles.trainName}>
        {segment.features.namedTrain?.title || segment.train.title}
      </div>
      <div className={styles.company}>{segment.company.title}</div>
    </div>
  );
}