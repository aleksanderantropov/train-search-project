import { getTariffName, calculateSeatCounts } from '@/utils/trainUtils';
import { formatPrice } from '@/utils/priceUtils';
import type { SearchResponse } from '@/lib/slices/searchSlice';
import styles from './SegmentTariffs.module.css';

interface SegmentTariffsProps {
  segment: SearchResponse['variants'][0]['forward'][0];
  className?: string;
}

export default function SegmentTariffs({ segment, className }: SegmentTariffsProps) {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.tariffList}>
        {Object.entries(segment.tariffs.classes).map(
          ([tariffType, tariff]) => {
            const { lowerPlaces, upperPlaces, totalSeats, isSitting } = 
              calculateSeatCounts(tariff, tariffType);

            return (
              <div key={tariffType} className={styles.tariffItem}>
                <div className={styles.tariffName}>
                  {getTariffName(tariffType)}
                </div>
                <div className={styles.tariffPrice}>
                  от {formatPrice(tariff.price)}
                </div>
                {isSitting ? (
                  <div className={styles.seats}>{totalSeats} мест</div>
                ) : (
                  <div className={styles.seats}>
                    {lowerPlaces} ниж {upperPlaces} верх
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}