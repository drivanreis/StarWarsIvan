import { vi } from 'vitest';
import { testData } from './mock/testData';
import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from '../hooks/useFetch';

describe('Test the useFetch hook', () => {
  beforeEach(() => vi.clearAllMocks());
  
  const END_POINT = 'https://swapi.dev/api/planets';
  
  it('test if useFetch call fetch with correct endpoint', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => (testData),
    });    

    const { result } = renderHook(() => useFetch(END_POINT));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      const currHookReturn = result.current;
      expect(currHookReturn.isLoading).toBe(false);
    }, { timeout: 5000 });
    
    expect(global.fetch).toHaveBeenCalledWith(END_POINT);
  });

  it('Test if the useFetch hook handles errors correctly.', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('test error'));    

    const { result } = renderHook(() => useFetch(END_POINT));

    await waitFor(async () => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });
    
    const currHookReturn = result.current;
    expect(currHookReturn.isError).toBe(true);
    expect(currHookReturn.errorMsg).toBe('test error');
  });

  it('Test if the useFetch hook handles unknown errors correctly.', async () => {
    global.fetch = vi.fn().mockRejectedValue({});    

    const { result } = renderHook(() => useFetch(END_POINT));

    await waitFor(async () => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });
    
    const currHookReturn = result.current;
    expect(currHookReturn.isError).toBe(true);
    expect(currHookReturn.errorMsg).toBe('Unknown error');
  });
});
