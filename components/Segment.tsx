'use client';

import styles from './Segment.module.css';

// Helper function to format date and time
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
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
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
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
          };
          facilities: string[];
        };
      };
    };
  };
}

export default function Segment({ segment }: SegmentProps) {
  const segmentFacilities = getSegmentFacilities(segment.tariffs);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Segment Details</h3>

      {/* Date and Time */}
      <div className={styles.section}>
        <h4>Schedule</h4>
        <div className={styles.grid}>
          <div>
            <strong>Departure:</strong>
            <div>{formatDateTime(segment.departure).date}</div>
            <div>{formatDateTime(segment.departure).time}</div>
          </div>
          <div>
            <strong>Arrival:</strong>
            <div>{formatDateTime(segment.arrival).date}</div>
            <div>{formatDateTime(segment.arrival).time}</div>
          </div>
        </div>
      </div>

      {/* Stations */}
      <div className={styles.section}>
        <h4>Stations</h4>
        <div className={styles.grid}>
          <div>
            <strong>Departure Station:</strong>
            <div>{segment.stationFrom.title}</div>
            <div className={styles.settlement}>
              {segment.stationFrom.settlement.title}
            </div>
          </div>
          <div>
            <strong>Arrival Station:</strong>
            <div>{segment.stationTo.title}</div>
            <div className={styles.settlement}>
              {segment.stationTo.settlement.title}
            </div>
          </div>
        </div>
      </div>

      {/* Travel Time */}
      <div className={styles.section}>
        <strong>Travel Time:</strong> {formatDuration(segment.duration)}
      </div>

      {/* Train Information */}
      <div className={styles.section}>
        <h4>Train Information</h4>
        <div>
          <strong>Train Number:</strong> {segment.train.displayNumber}
        </div>
        <div>
          <strong>Train Name:</strong>{' '}
          {segment.features.namedTrain?.title || segment.train.title}
        </div>
        <div>
          <strong>Provider Company:</strong> {segment.company.title}
        </div>
      </div>

      {/* Facilities */}
      {segmentFacilities.length > 0 && (
        <div className={styles.section}>
          <h4>Facilities</h4>
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
        </div>
      )}

      {/* Tariff List */}
      <div className={styles.tariffSection}>
        <h4>Tariffs</h4>
        <div className={styles.tariffList}>
          {Object.entries(segment.tariffs.classes).map(
            ([tariffType, tariff]) => {
              const lowerPlaces = tariff.placesDetails?.lower?.quantity || 0;
              const upperPlaces = tariff.placesDetails?.upper?.quantity || 0;
              const totalSeats = tariff.seats || 0;
              const isSitting = lowerPlaces === 0 && upperPlaces === 0;

              return (
                <div key={tariffType} className={styles.tariffItem}>
                  <div className={styles.tariffContent}>
                    <div>
                      <strong className={styles.tariffType}>
                        {tariffType}
                      </strong>
                      <div className={styles.tariffDetails}>
                        <div>
                          Price: {tariff.price.value.toLocaleString()}{' '}
                          {tariff.price.currency}
                        </div>
                        {isSitting ? (
                          <div>Seats: {totalSeats}</div>
                        ) : (
                          <div>
                            Lower: {lowerPlaces} | Upper: {upperPlaces}
                          </div>
                        )}
                      </div>
                    </div>
                    {tariff.hasNonRefundableTariff && (
                      <span className={styles.nonRefundableBadge}>
                        Non-refundable
                      </span>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div className={styles.minPriceContainer}>
          <strong>Minimum Price:</strong>{' '}
          {(() => {
            const segmentMinPrice = findMinPrice(segment.tariffs);
            return segmentMinPrice
              ? `${segmentMinPrice.value.toLocaleString()} ${
                  segmentMinPrice.currency
                }`
              : 'N/A';
          })()}
        </div>
      </div>
    </div>
  );
}
