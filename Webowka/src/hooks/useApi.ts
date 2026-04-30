/**
 * useApi – generic React hook for data fetching from the DriveAndAlive API.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi(() => api.leaderboard.get());
 */

import { useState, useEffect, useCallback, useRef } from "react";

export interface UseApiState<T> {
  data:    T | null;
  loading: boolean;
  error:   string | null;
  refetch: () => void;
}

/**
 * Fetches data from the API and manages loading / error state.
 * Re-fetches when `deps` change (like useEffect).
 *
 * @param fetcher - function that returns a Promise<T>
 * @param deps    - dependency array (like useEffect)
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
): UseApiState<T> {
  const [data,    setData]    = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const fetcherRef            = useRef(fetcher);

  // Keep the fetcher ref up-to-date without re-triggering the effect
  useEffect(() => { fetcherRef.current = fetcher; });

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcherRef.current()
      .then((result) => { if (!cancelled) { setData(result); } })
      .catch((err: Error) => { if (!cancelled) { setError(err.message); } })
      .finally(() => { if (!cancelled) { setLoading(false); } });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    return load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
