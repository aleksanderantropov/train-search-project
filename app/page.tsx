'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchSearchData } from '@/lib/slices/searchSlice';
import { useSegmentProcessing } from './hooks/useSegmentProcessing';
import Header from '@/components/Header';
import VariantList from '@/components/VariantList';
import ErrorMessage from '@/components/ErrorMessage';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './page.module.css';

export default function Home() {
  const dispatch = useAppDispatch();
  const { data, loading, error, minDuration } = useAppSelector((state) => state.search);
  const { firstNextDaySegmentId } = useSegmentProcessing(data);

  useEffect(() => {
    dispatch(fetchSearchData());
  }, [dispatch]);

  return (
    <main className='container'>
      <div className='content'>
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage error={error} />}
        {data && (
          <div>
            <p>Статус: {data.status}</p>
            <p>Найдено вариантов: {data.variants.length}</p>

            <Header />

            <VariantList 
              variants={data.variants}
              firstNextDaySegmentId={firstNextDaySegmentId}
              globalMinPrice={data.minPrice?.forward || null}
              minDuration={minDuration}
            />
          </div>
        )}
      </div>
    </main>
  );
}
