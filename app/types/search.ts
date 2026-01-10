import type { SearchResponse } from '@/lib/slices/searchSlice';

export interface ProcessedSegment {
  segment: SearchResponse['variants'][0]['forward'][0];
  variantId: string;
}

export interface SegmentProcessingResult {
  allSegments: ProcessedSegment[];
  searchDate: string | null;
  firstNextDaySegmentId: string | null;
}