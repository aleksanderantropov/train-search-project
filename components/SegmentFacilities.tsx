import { getFacilityIcon } from '@/utils/trainUtils';
import styles from './Segment.module.css';

interface SegmentFacilitiesProps {
  facilities: string[];
}

export default function SegmentFacilities({ facilities }: SegmentFacilitiesProps) {
  if (facilities.length === 0) {
    return null;
  }

  return (
    <div className={styles.facilities}>
      {facilities
        .map((facility) => {
          const icon = getFacilityIcon(facility);
          return icon ? (
            <span
              key={facility}
              className={styles.facilityIcon}
              title={facility}
            >
              {icon}
            </span>
          ) : null;
        })
        .filter(Boolean)}
    </div>
  );
}