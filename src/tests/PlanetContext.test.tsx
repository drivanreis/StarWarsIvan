// Eu sou Naviivan, um Jedi iniciante.
// E vou tentar deixar o código o mais bem explicado possível,
// com a maioria das variáveis em português.

// Importação das bibliotecas e configurações necessárias para os testes
import { useContext } from 'react';
import { vi } from 'vitest';
import { testData } from './mock/testData';
import { renderHook, waitFor } from '@testing-library/react';
import { PlanetContext, ProvedorContextoPlanetas } from '../context/PlanetContext';
import { TipoDePlanetaSemResidentes } from '../types';

// Configuração global do fetch mockado para retornar dados de teste
global.fetch = vi.fn().mockResolvedValue({
  json: async () => (testData),
});

// Função para ordenar a lista de planetas com base na chave e ordem especificadas
const sortByKey = (
  list: TipoDePlanetaSemResidentes[],
  key: keyof TipoDePlanetaSemResidentes,
  order: 'asc' | 'desc',
) => {
  const sortedList = [...list];

  if (order !== 'asc' && order !== 'desc') return sortedList;

  sortedList.sort((a, b) => {
    if (a[key] === 'unknown') return 1;
    if (b[key] === 'unknown') return -1;

    const aValue = Number(a[key]);
    const bValue = Number(b[key]);

    if (order === 'asc') {
      return aValue - bValue;
    }
    if (order === 'desc') {
      return bValue - aValue;
    }
    return 0;
  });

  return sortedList;
};

// Função para remover a chave 'residents' dos planetas
const removeResidents = () => {
  return testData.results.map((planet) => {
    const { residents, ...planetWithoutResidents } = planet;
    return planetWithoutResidents;
  });
};

describe('Teste o contexto do planeta', () => {
  const planetsWithoutResidents = removeResidents();

// Teste para verificar se a chave 'residents' foi removida
  test('Teste se a chave “residentes” foi removida.', async () => {
    const { result } = renderHook(() => useContext(PlanetContext), { wrapper: ProvedorContextoPlanetas });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 } );

    const currHookReturn = result.current;

    expect(currHookReturn.isError).toBe(false);
    expect(currHookReturn.planets).toEqual(planetsWithoutResidents);
  });

  // Teste para verificar se a função filterPlanetByText funciona corretamente
  test('Teste se a função filterPlanetByText funciona corretamente.', async () => {
    const { result, rerender } = renderHook(() => useContext(PlanetContext), { wrapper: ProvedorContextoPlanetas });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 } );

    result.current.filterPlanetsByText('Hoth');
    rerender();

    expect(result.current.planets).not.toBeNull();
    if (result.current.planets && result.current.planets?.length > 0) {
      expect(result.current.planets[0]).toHaveProperty('name', 'Hoth');
    } else fail('Planets is not an array.');
  });
  
  // Teste para verificar se a função sortList funciona corretamente
  test('Teste se a função sortList funciona corretamente', async () => {
    const { result, rerender } = renderHook(() => useContext(PlanetContext), { wrapper: ProvedorContextoPlanetas });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 } );

    result.current.sortList('population', 'asc');
    rerender();

    expect(result.current.planets).toEqual(sortByKey(planetsWithoutResidents, 'population', 'asc'));

    result.current.sortList('population', 'desc');
    rerender();

    expect(result.current.planets).toEqual(sortByKey(planetsWithoutResidents, 'population', 'desc'));

    result.current.sortList('population', 'desc');
    rerender();

    expect(result.current.planets).not.toEqual(sortByKey(planetsWithoutResidents, 'population', 'asc'));

    result.current.removeAllFilters();
    // @ts-expect-error
    result.current.sortList('population', 'test');
    rerender();
    expect(result.current.planets).toEqual(planetsWithoutResidents);
  }); 

  test('Teste se os planetas são retidos quando um filtro inválido é aplicado.', async () => {
    const { result, rerender } = renderHook(() => useContext(PlanetContext), { wrapper: ProvedorContextoPlanetas });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 } );

    // @ts-ignore
    result.current.filterPlanetsByKey('population', 'test', 100);
    rerender();
    expect(result.current.planets).toEqual(planetsWithoutResidents);
  });

  test('Teste se a função filterPlanetsByKey funciona corretamente', async () => {
    const { result, rerender } = renderHook(() => useContext(PlanetContext), { wrapper: ProvedorContextoPlanetas });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 } );

    result.current.filterPlanetsByKey('population', 'menor que', 1001);
    rerender();
    expect(result.current.planets).not.toBeNull();
    if (result.current.planets && result.current.planets?.length > 0) {
      expect(result.current.planets[0]).toHaveProperty('name', 'Yavin IV');
    } else fail('Planets is not an array or is empty.');

    expect(result.current.filters[0]).toEqual({
      key: 'population',
      operator: 'menor que',
      compareValue: 1001,
    });

    result.current.removeFilter('population');
    rerender();

    expect(result.current.filters[0]).not.toEqual({
      key: 'population',
      operator: 'menor que',
      compareValue: 1001,
    });
  });
});
