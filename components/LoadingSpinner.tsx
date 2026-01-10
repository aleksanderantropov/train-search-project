import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Загружаю данные поиска...</p>
    </div>
  );
}