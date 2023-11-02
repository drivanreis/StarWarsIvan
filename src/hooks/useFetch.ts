import { useCallback, useEffect, useState } from 'react';

export function useFetch<T, S>(url: string, middleware?: (data: T) => S) {
  const [data, setData] = useState<S | T | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const makeRequest = useCallback((makeRequestUrl: string) => {
    setLoading(true);
    fetch(makeRequestUrl)
      .then((response) => response.json())
      .then((responseJson: T) => {
        if (middleware) setData(middleware(responseJson));
        else setData(responseJson);
      })
      .catch((error) => {
        setError(true);
        if (error instanceof Error) setErrorMsg(error.message);
        else setErrorMsg('Unknown error');
      })
      .finally(() => setLoading(false));
  }, [middleware]);

  useEffect(() => {
    makeRequest(url);
  }, [makeRequest, url]);

  return {
    data,
    isLoading,
    isError,
    errorMsg,
    makeRequest,
  };
}
