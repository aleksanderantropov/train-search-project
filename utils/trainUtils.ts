// Train, facility, and tariff utilities

export const getFacilityIcon = (facilityCode: string): string | null => {
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
    PAP: null,
  };

  return facilityMap[facilityCode] || null;
};

export const getSegmentFacilities = (tariffs: {
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

  let commonFacilities = new Set(tariffEntries[0].facilities || []);

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

export const getTariffName = (type: string): string => {
  const nameMap: { [key: string]: string } = {
    compartment: 'Купе',
    suite: 'СВ',
    sitting: 'Сидячий',
    platzkarte: 'Плац',
  };
  return nameMap[type.toLowerCase()] || type;
};

export const calculateSeatCounts = (tariff: any, tariffType: string) => {
  const isPlatzkarte = tariffType.toLowerCase() === 'platzkarte';
  const lowerPlaces =
    (tariff.placesDetails?.lower?.quantity || 0) +
    (isPlatzkarte ? tariff.placesDetails?.lowerSide?.quantity || 0 : 0);
  const upperPlaces =
    (tariff.placesDetails?.upper?.quantity || 0) +
    (isPlatzkarte ? tariff.placesDetails?.upperSide?.quantity || 0 : 0);
  const totalSeats = tariff.seats || 0;
  const isSitting = lowerPlaces === 0 && upperPlaces === 0;

  return { lowerPlaces, upperPlaces, totalSeats, isSitting };
};

export const checkSegmentBadges = (
  segment: any,
  segmentMinPrice: any,
  globalMinPrice: any,
  minDuration: number | null
) => {
  const hasNonRefundableTariff = Object.values(segment.tariffs.classes).some(
    (tariff: any) => tariff.hasNonRefundableTariff
  );

  const isCheapestSegment =
    segmentMinPrice &&
    globalMinPrice &&
    segmentMinPrice.value === globalMinPrice.value &&
    segmentMinPrice.currency === globalMinPrice.currency;

  const isFastestSegment =
    minDuration !== null && segment.duration === minDuration;

  return { hasNonRefundableTariff, isCheapestSegment, isFastestSegment };
};