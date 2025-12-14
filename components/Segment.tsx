'use client';

import { useAppSelector } from '@/lib/hooks';
import styles from './Segment.module.css';

// Helper function to format date and time
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return { date: dateStr, time: timeStr };
};

// Helper function to format duration in human readable format
const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0 && minutes > 0) {
    return `${hours} ч ${minutes} м`;
  } else if (hours > 0) {
    return `${hours} ч`;
  } else {
    return `${minutes} м`;
  }
};

// Helper function to find minimum price from all tariffs
const findMinPrice = (tariffs: { classes: { [key: string]: any } }) => {
  let minPrice = Infinity;
  let minCurrency = '';

  Object.values(tariffs.classes).forEach((tariffClass: any) => {
    if (tariffClass.price && tariffClass.price.value < minPrice) {
      minPrice = tariffClass.price.value;
      minCurrency = tariffClass.price.currency;
    }
  });

  return minPrice !== Infinity
    ? { value: minPrice, currency: minCurrency }
    : null;
};

// Map facility codes to icons/labels
const getFacilityIcon = (facilityCode: string): string | null => {
  const facilityMap: { [key: string]: string | null } = {
    BED: '🛏️',
    COND: '❄️',
    PETS: '🐾',
    REST: '🍽️',
    S220: '🔌',
    SAN: '🚿',
    SLPR: '😴',
    WC: '🚽',
    WIFI: '📶',
    EAT: '🍴',
    GENDER_CABIN: '🚻',
    PAP: null, // Unknown, ignore
  };

  return facilityMap[facilityCode] || null;
};

// Find intersection of facilities across all tariffs
const getSegmentFacilities = (tariffs: {
  classes: {
    [key: string]: {
      facilities: string[];
    };
  };
}): string[] => {
  const tariffEntries = Object.values(tariffs.classes);
  if (tariffEntries.length === 0) {
    return [];
  }

  // Start with facilities from the first tariff
  let commonFacilities = new Set(tariffEntries[0].facilities || []);

  // Intersect with facilities from all other tariffs
  for (let i = 1; i < tariffEntries.length; i++) {
    const currentFacilities = new Set(tariffEntries[i].facilities || []);
    commonFacilities = new Set(
      Array.from(commonFacilities).filter((facility) =>
        currentFacilities.has(facility)
      )
    );
  }

  return Array.from(commonFacilities);
};

interface SegmentProps {
  segment: {
    id: string;
    departure: string;
    arrival: string;
    duration: number;
    stationFrom: {
      id: string;
      title: string;
      settlement: {
        title: string;
      };
    };
    stationTo: {
      id: string;
      title: string;
      settlement: {
        title: string;
      };
    };
    company: {
      id: number;
      title: string;
    };
    train: {
      title: string;
      number: string;
      displayNumber: string;
    };
    features: {
      namedTrain?: {
        title: string;
      };
    };
    tariffs: {
      classes: {
        [key: string]: {
          type: string;
          price: {
            value: number;
            currency: string;
          };
          seats: number;
          hasNonRefundableTariff: boolean;
          placesDetails?: {
            lower?: { quantity: number };
            upper?: { quantity: number };
            lowerSide?: { quantity: number };
            upperSide?: { quantity: number };
          };
          facilities: string[];
        };
      };
    };
  };
}

export default function Segment({ segment }: SegmentProps) {
  const { data, minDuration } = useAppSelector((state) => state.search);
  const segmentFacilities = getSegmentFacilities(segment.tariffs);
  const segmentMinPrice = findMinPrice(segment.tariffs);
  const departure = formatDateTime(segment.departure);
  const arrival = formatDateTime(segment.arrival);

  // Check if any tariff has non-refundable tariff
  const hasNonRefundableTariff = Object.values(segment.tariffs.classes).some(
    (tariff) => tariff.hasNonRefundableTariff
  );

  // Check if this segment has the cheapest price (matches route min price)
  const globalMinPrice = data?.minPrice?.forward;
  const isCheapestSegment =
    segmentMinPrice &&
    globalMinPrice &&
    segmentMinPrice.value === globalMinPrice.value &&
    segmentMinPrice.currency === globalMinPrice.currency;

  // Check if this segment is the fastest (matches global min duration)
  const isFastestSegment =
    minDuration !== null && segment.duration === minDuration;

  // Map tariff type names
  const getTariffName = (type: string): string => {
    const nameMap: { [key: string]: string } = {
      compartment: 'Купе',
      suite: 'СВ',
      sitting: 'Сидячий',
      platzkarte: 'Плац',
    };
    return nameMap[type.toLowerCase()] || type;
  };

  return (
    <div className={styles.container}>
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
      <div className={styles.mainContent}>
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
          <div className={styles.trainInfo}>
            <div className={styles.trainNumber}>
              {segment.train.displayNumber}
            </div>
            <div className={styles.trainName}>
              {segment.features.namedTrain?.title || segment.train.title}
            </div>
            <div className={styles.company}>{segment.company.title}</div>
          </div>
        </div>

        {/* Right-Middle: Tariffs */}
        <div className={styles.tariffs}>
          <div className={styles.tariffList}>
            {Object.entries(segment.tariffs.classes).map(
              ([tariffType, tariff]) => {
                const isPlatzkarte = tariffType.toLowerCase() === 'platzkarte';
                const lowerPlaces =
                  (tariff.placesDetails?.lower?.quantity || 0) +
                  (isPlatzkarte
                    ? tariff.placesDetails?.lowerSide?.quantity || 0
                    : 0);
                const upperPlaces =
                  (tariff.placesDetails?.upper?.quantity || 0) +
                  (isPlatzkarte
                    ? tariff.placesDetails?.upperSide?.quantity || 0
                    : 0);
                const totalSeats = tariff.seats || 0;
                const isSitting = lowerPlaces === 0 && upperPlaces === 0;

                return (
                  <div key={tariffType} className={styles.tariffItem}>
                    <div className={styles.tariffName}>
                      {getTariffName(tariffType)}
                    </div>
                    <div className={styles.tariffPrice}>
                      от {tariff.price.value.toLocaleString()}{' '}
                      {tariff.price.currency === 'RUB'
                        ? '₽'
                        : tariff.price.currency}
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

        {/* Rightmost: Min Price and Button */}
        <div className={styles.rightmost}>
          {segmentMinPrice && (
            <div className={styles.minPriceRight}>
              от {segmentMinPrice.value.toLocaleString()}{' '}
              {segmentMinPrice.currency === 'RUB'
                ? '₽'
                : segmentMinPrice.currency}
            </div>
          )}
          {segmentMinPrice && (
            <button className={styles.selectButton}>Выбрать место</button>
          )}
        </div>
      </div>

      {/* Bottom: Facilities */}
      {segmentFacilities.length > 0 && (
        <div className={styles.facilities}>
          {segmentFacilities
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
      )}
    </div>
  );
}
