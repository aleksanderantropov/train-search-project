import { formatDateTime, formatDuration } from '@/utils/dateUtils';
import type { SearchResponse } from '@/lib/slices/searchSlice';
import SegmentTrainInfo from './SegmentTrainInfo';
import styles from './Segment.module.css';

interface SegmentTimesProps {
  segment: SearchResponse['variants'][0]['forward'][0];
}

export default function SegmentTimes({ segment }: SegmentTimesProps) {
  const departure = formatDateTime(segment.departure);
  const arrival = formatDateTime(segment.arrival);

  return (
    <>
      {/* Left: Departure */}
      <div className={styles.departure}>
        <div className={styles.time}>{departure.time}</div>
        <div className={styles.date}>{departure.date}</div>
        <div className={styles.station}>{segment.stationFrom.title}</div>
      </div>

      {/* Middle-Left: Arrival */}
      <div className={styles.arrival}>
        <div className={styles.time}>{arrival.time}</div>
        <div className={styles.date}>{arrival.date}</div>
        <div className={styles.station}>{segment.stationTo.title}</div>
      </div>

      {/* Middle: Duration and Train Info */}
      <div className={styles.middle}>
        <div className={styles.duration}>
          {formatDuration(segment.duration)}
        </div>
        <SegmentTrainInfo segment={segment} />
      </div>
    </>
  );
}