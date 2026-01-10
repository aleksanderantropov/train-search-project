import { useMemo } from 'react';
import type { SearchResponse } from '@/lib/slices/searchSlice';
import { findEarliestDepartureGlobal, findFirstNextDaySegmentIdGlobal } from '@/utils/segmentUtils';

export function useSegmentProcessing(
  data: SearchResponse | null
): { firstNextDaySegmentId: string | null } {
  return useMemo(() => {
    if (!data) {
      return { firstNextDaySegmentId: null };
    }

    const searchDate = findEarliestDepartureGlobal(data);
    const firstNextDaySegmentId = searchDate 
      ? findFirstNextDaySegmentIdGlobal(data, searchDate)
      : null;

    return { firstNextDaySegmentId };
  }, [data]);
}
