import { useEffect, useRef } from 'react';

export function useAutoRefresh(callback: () => void, interval: number = 30000) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval
    intervalRef.current = setInterval(callback, interval);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callback, interval]);

  // Function to manually refresh
  const refresh = () => {
    callback();
  };

  return { refresh };
} 