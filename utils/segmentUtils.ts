// Segment processing and analysis utilities

import type { SearchResponse } from '@/lib/slices/searchSlice';
import { isNextDaySegment } from './dateUtils';
import { findMinPrice } from './priceUtils';

type Segment = SearchResponse['variants'][0]['forward'][0];

export interface DirectionalData {
  segments: Segment[];
  minPrice: { value: number; currency: string } | null;
  minDuration: number | null;
  firstNextDaySegmentId: string | null;
}

export const findEarliestDeparture = (segments: Segment[]): string | null => {
  let earliestDate: string | null = null;
  
  for (const segment of segments) {
    if (!earliestDate || segment.departure < earliestDate) {
      earliestDate = segment.departure;
    }
  }
  
  return earliestDate;
};

export const findDirectionalMinPrice = (segments: Segment[]) => {
  let globalMinPrice: { value: number; currency: string } | null = null;
  
  for (const segment of segments) {
    const segmentMinPrice = findMinPrice(segment.tariffs);
    if (segmentMinPrice && (!globalMinPrice || segmentMinPrice.value < globalMinPrice.value)) {
      globalMinPrice = segmentMinPrice;
    }
  }
  
  return globalMinPrice;
};

export const findDirectionalMinDuration = (segments: Segment[]): number | null => {
  let minDuration: number | null = null;
  
  for (const segment of segments) {
    if (minDuration === null || segment.duration < minDuration) {
      minDuration = segment.duration;
    }
  }
  
  return minDuration;
};

export const findFirstNextDaySegmentId = (
  segments: Segment[],
  searchDate: string
): string | null => {
  for (const segment of segments) {
    if (isNextDaySegment(segment.departure, searchDate)) {
      return segment.id;
    }
  }
  return null;
};

export const calculateDirectionalData = (segments: Segment[]): DirectionalData => {
  if (segments.length === 0) {
    return {
      segments: [],
      minPrice: null,
      minDuration: null,
      firstNextDaySegmentId: null,
    };
  }

  const minPrice = findDirectionalMinPrice(segments);
  const minDuration = findDirectionalMinDuration(segments);
  const searchDate = findEarliestDeparture(segments);
  const firstNextDaySegmentId = searchDate 
    ? findFirstNextDaySegmentId(segments, searchDate)
    : null;

  return {
    segments,
    minPrice,
    minDuration,
    firstNextDaySegmentId,
  };
};

export const extractDirectionalSegments = (
  variants: SearchResponse['variants'], 
  direction: 'forward' | 'backward'
): Segment[] => {
  const segments: Segment[] = [];
  
  for (const variant of variants) {
    const directionSegments = direction === 'forward' ? variant.forward : variant.backward;
    if (directionSegments) {
      segments.push(...directionSegments);
    }
  }
  
  return segments;
};

// Legacy functions for backward compatibility
export const findEarliestDepartureGlobal = (data: SearchResponse): string | null => {
  const allSegments = [
    ...extractDirectionalSegments(data.variants, 'forward'),
    ...extractDirectionalSegments(data.variants, 'backward')
  ];
  return findEarliestDeparture(allSegments);
};

export const findFirstNextDaySegmentIdGlobal = (
  data: SearchResponse,
  searchDate: string
): string | null => {
  const allSegments = [
    ...extractDirectionalSegments(data.variants, 'forward'),
    ...extractDirectionalSegments(data.variants, 'backward')
  ];
  return findFirstNextDaySegmentId(allSegments, searchDate);
};