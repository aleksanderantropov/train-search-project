'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setSearchData, setLoading, setError } from '@/lib/slices/searchSlice';
import type { SearchResponse } from '@/lib/slices/searchSlice';
import Segment from '@/components/Segment';
import Header from '@/components/Header';
import styles from './page.module.css';

// Helper function to check if segment departure is on next day (00:00-03:00) compared to search date
const isNextDaySegment = (
  departureIsoString: string,
  searchDateIsoString: string
): boolean => {
  const departureDate = new Date(departureIsoString);
  const searchDate = new Date(searchDateIsoString);

  // Normalize both dates to midnight for date comparison
  const searchYear = searchDate.getFullYear();
  const searchMonth = searchDate.getMonth();
  const searchDay = searchDate.getDate();

  const depYear = departureDate.getFullYear();
  const depMonth = departureDate.getMonth();
  const depDay = departureDate.getDate();

  // Segment is on the next day if departure is exactly 1 calendar day after search date
  const isDayAfter =
    depYear === searchYear &&
    depMonth === searchMonth &&
    depDay === searchDay + 1;

  const hours = departureDate.getHours();
  // Only mark as next day segment if it's departure in 00:00-03:00 AND it's truly next date after search
  return isDayAfter && hours >= 0 && hours < 3;
};

// Helper function to format date in Russian format (e.g., "13 декабря")
const formatDateHeader = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });
};

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

  // Find search date (earliest departure time) and collect all segments for date header logic
  const allSegments: Array<{
    segment: SearchResponse['variants'][0]['forward'][0];
    variantId: string;
  }> = [];
  let searchDate: string | null = null;

  if (data) {
    data.variants.forEach((variant) => {
      variant.forward.forEach((segment) => {
        allSegments.push({ segment, variantId: variant.id });
        if (!searchDate || segment.departure < searchDate) {
          searchDate = segment.departure;
        }
      });
      if (variant.backward) {
        variant.backward.forEach((segment) => {
          allSegments.push({ segment, variantId: variant.id });
          if (!searchDate || segment.departure < searchDate) {
            searchDate = segment.departure;
          }
        });
      }
    });
  }

  // Find the first next-day segment to show date header before it
  const firstNextDaySegmentId =
    searchDate && allSegments.length > 0
      ? allSegments.find(({ segment }) =>
          isNextDaySegment(segment.departure, searchDate!)
        )?.segment.id
      : null;

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
                    {/* Forward segments */}
                    {variant.forward.map((segment, segmentIndex) => (
                      <div key={segment.id}>
                        {segment.id === firstNextDaySegmentId && (
                          <div className={styles.dateHeader}>
                            {formatDateHeader(segment.departure)}
                          </div>
                        )}
                        <div className={styles.segmentContainer}>
                          {variant.forward.length > 1 && (
                            <h3 className={styles.segmentTitle}>
                              Forward Segment {segmentIndex + 1}
                            </h3>
                          )}
                          <Segment segment={segment} />
                        </div>
                      </div>
                    ))}

                    {/* Backward segments */}
                    {variant.backward &&
                      variant.backward.map((segment, segmentIndex) => (
                        <div key={segment.id}>
                          {segment.id === firstNextDaySegmentId && (
                            <div className={styles.dateHeader}>
                              {formatDateHeader(segment.departure)}
                            </div>
                          )}
                          <div className={styles.segmentContainer}>
                            <h3 className={styles.segmentTitle}>
                              Backward Segment {segmentIndex + 1}
                            </h3>
                            <Segment segment={segment} />
                          </div>
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
