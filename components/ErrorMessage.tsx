import { useAppDispatch } from '@/lib/hooks';
import { fetchSearchData } from '@/lib/slices/searchSlice';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  error: string;
  className?: string;
}

export default function ErrorMessage({ error, className }: ErrorMessageProps) {
  const dispatch = useAppDispatch();

  const handleRetry = () => {
    dispatch(fetchSearchData());
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <p className={styles.error}>Ошибка: {error}</p>
      <button 
        onClick={handleRetry}
        className={styles.retryButton}
      >
        Повторить
      </button>
    </div>
  );
}