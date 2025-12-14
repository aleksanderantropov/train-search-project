'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setSearchData, setLoading, setError } from '@/lib/slices/searchSlice';
import type { SearchResponse } from '@/lib/slices/searchSlice';
import Segment from '@/components/Segment';
import Header from '@/components/Header';
import styles from './page.module.css';

export default function Home() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.search);

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        dispatch(setLoading(true));
        const response = await fetch('/api/search');
        if (!response.ok) {
          throw new Error('Failed to fetch search data');
        }
        const searchData: SearchResponse = await response.json();
        dispatch(setSearchData(searchData));
      } catch (err) {
        dispatch(
          setError(err instanceof Error ? err.message : 'An error occurred')
        );
      }
    };

    fetchSearchData();
  }, [dispatch]);

  return (
    <main className='container'>
      <div className='content'>
        {loading && <p>Loading search data...</p>}
        {error && <p className={styles.error}>Error: {error}</p>}
        {data && (
          <div>
            <p>Status: {data.status}</p>
            <p>Variants found: {data.variants.length}</p>

            <Header />

            {/* All variants */}
            {data.variants.length > 0 && (
              <div className={styles.variantsContainer}>
                <h2 className={styles.variantsTitle}>
                  All Variants ({data.variants.length})
                </h2>
                {data.variants.map((variant, variantIndex) => (
                  <div key={variant.id} className={styles.variantContainer}>
                    <h3 className={styles.variantTitle}>
                      Variant {variantIndex + 1}
                    </h3>

                    {/* Forward segments */}
                    {variant.forward.map((segment, segmentIndex) => (
                      <div key={segment.id} className={styles.segmentContainer}>
                        {variant.forward.length > 1 && (
                          <h4 className={styles.segmentTitle}>
                            Forward Segment {segmentIndex + 1}
                          </h4>
                        )}
                        <Segment segment={segment} />
                      </div>
                    ))}

                    {/* Backward segments */}
                    {variant.backward &&
                      variant.backward.map((segment, segmentIndex) => (
                        <div
                          key={segment.id}
                          className={styles.segmentContainer}
                        >
                          <h4 className={styles.segmentTitle}>
                            Backward Segment {segmentIndex + 1}
                          </h4>
                          <Segment segment={segment} />
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
