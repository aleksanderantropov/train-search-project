import { useMemo } from 'react';
import type { SearchResponse } from '@/lib/slices/searchSlice';
import { extractDirectionalSegments } from '@/utils/segmentUtils';
import Tabs from './Tabs';
import DirectionalSegmentList from './DirectionalSegmentList';
import styles from './VariantList.module.css';

interface VariantListProps {
  variants: SearchResponse['variants'];
  className?: string;
}

const getDirectionAvailability = (variants: SearchResponse['variants']) => {
  const forwardSegments = extractDirectionalSegments(variants, 'forward');
  const backwardSegments = extractDirectionalSegments(variants, 'backward');
  
  return {
    hasForward: forwardSegments.length > 0,
    hasBackward: backwardSegments.length > 0,
  };
};

const renderTitle = (variantCount: number) => (
  <h2 className={styles.title}>
    Результаты поиска ({variantCount} вариант{variantCount !== 1 ? 'ов' : ''})
  </h2>
);

const createTabs = (variants: SearchResponse['variants']) => [
  {
    id: 'forward',
    label: 'Туда',
    content: (
      <DirectionalSegmentList 
        variants={variants} 
        direction="forward"
      />
    ),
  },
  {
    id: 'backward',
    label: 'Обратно',
    content: (
      <DirectionalSegmentList 
        variants={variants} 
        direction="backward"
      />
    ),
  },
];

export default function VariantList({ variants, className }: VariantListProps) {
  const { hasForward, hasBackward } = useMemo(
    () => getDirectionAvailability(variants),
    [variants]
  );

  if (!hasForward && !hasBackward) {
    return null;
  }

  const containerClass = `${styles.container} ${className || ''}`;
  const title = renderTitle(variants.length);

  // Single direction: render without tabs
  if (hasForward !== hasBackward) {
    const direction = hasForward ? 'forward' : 'backward';
    return (
      <div className={containerClass}>
        {title}
        <DirectionalSegmentList 
          variants={variants} 
          direction={direction}
        />
      </div>
    );
  }

  // Both directions: render with tabs
  return (
    <div className={containerClass}>
      {title}
      <Tabs tabs={createTabs(variants)} defaultActiveTab="forward" />
    </div>
  );
}