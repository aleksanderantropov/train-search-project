'use client';

import { useMemo } from 'react';
import { getSegmentFacilities, checkSegmentBadges } from '@/utils/trainUtils';
import { findMinPrice } from '@/utils/priceUtils';
import type { SearchResponse } from '@/lib/slices/searchSlice';
import SegmentBadges from './SegmentBadges';
import SegmentTimes from './SegmentTimes';
import SegmentTariffs from './SegmentTariffs';
import SegmentActions from './SegmentActions';
import SegmentFacilities from './SegmentFacilities';
import styles from './Segment.module.css';

interface SegmentProps {
  segment: SearchResponse['variants'][0]['forward'][0];
  globalMinPrice?: { value: number; currency: string } | null;
  minDuration?: number | null;
}

export default function Segment({ 
  segment, 
  globalMinPrice = null, 
  minDuration = null 
}: SegmentProps) {
  const segmentMinPrice = useMemo(() => 
    findMinPrice(segment.tariffs), [segment.tariffs]
  );
  
  const segmentFacilities = useMemo(() => 
    getSegmentFacilities(segment.tariffs), [segment.tariffs]
  );
  
  const badges = useMemo(() => 
    checkSegmentBadges(segment, segmentMinPrice, globalMinPrice, minDuration),
    [segment, segmentMinPrice, globalMinPrice, minDuration]
  );

  return (
    <div className={styles.container}>
      <SegmentBadges {...badges} />
      
      <div className={styles.mainContent}>
        <SegmentTimes segment={segment} />
        <SegmentTariffs segment={segment} />
        <SegmentActions segmentMinPrice={segmentMinPrice} />
      </div>

      <SegmentFacilities facilities={segmentFacilities} />
    </div>
  );
}
