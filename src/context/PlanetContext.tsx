// Eu sou Naviivan, um Jedi iniciante.
// E vou tentar deixar o código o mais bem explicado possível,
// com a maioria das variáveis em português.

import { createContext, useEffect, useMemo, useState } from 'react';
import {
  RespostaAPI,
  TipoDeFiltro,
  FraseOperador,
  TipoContextoPlaneta,
  TipoDePlanetaSemResidentes,
} from '../types';
import { useFetch } from '../hooks/useFetch';

export const PlanetContext = createContext({} as TipoContextoPlaneta);

// Remove os residentes de cada planeta
const removeResidentsMiddleware = (data: RespostaAPI) => {
  return data.results.map((planet) => {
    const { residents, ...planetWithoutResidents } = planet;
    return planetWithoutResidents;
  });
};

// Função para classificar por chave e ordem
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

    return bValue - aValue;
  });

  return sortedList;
};

const INITIAL_FILTERS = [
  'population',
  'orbital_period',
  'diameter',
  'rotation_period',
  'surface_water',
];

export function ProvedorContextoPlanetas({ children }: { children: React.ReactNode }) {
  const {
    data: planetsWithOutResidents,
    isLoading,
    isError,
    errorMsg,
  } = useFetch<RespostaAPI, TipoDePlanetaSemResidentes[]>('https://swapi.dev/api/planets', removeResidentsMiddleware);

  const planets = planetsWithOutResidents as TipoDePlanetaSemResidentes[] | null;

  const [filteredPlanets, setFilteredPlanets] = useState(planets);
  const [filters, setFilters] = useState<TipoDeFiltro[]>([]);
  const [availableFilters, setAvailableFilters] = useState<string[]>(INITIAL_FILTERS);

  useEffect(() => {
    setFilteredPlanets(planets);
  }, [planets]);

  // Aplica os filtros aos planetas conforme as regras definidas
  useEffect(() => {
    let localFilteredPlanets = planets ?? [];
    const unavailableFilters: string[] = [];

    filters.forEach(({ key, compareValue, operator }) => {
      unavailableFilters.push(key);

      switch (operator) {
        case 'maior que': {
          localFilteredPlanets = localFilteredPlanets.filter((planet) => {
            return Number(planet[key]) > compareValue;
          });
          break;
        }
        case 'menor que': {
          localFilteredPlanets = localFilteredPlanets.filter((planet) => {
            return Number(planet[key]) < compareValue;
          });
          break;
        }
        case 'igual a': {
          localFilteredPlanets = localFilteredPlanets.filter((planet) => {
            return Number(planet[key]) === compareValue;
          });
          break;
        }
        default:
          break;
      }
    });

    setFilteredPlanets(localFilteredPlanets);
    setAvailableFilters(INITIAL_FILTERS.filter((filter) => {
      return !unavailableFilters.includes(filter);
    }));
  }, [filters, planets]);

  // Cria e fornece o contexto com funções e estados necessários
  const contextValue = useMemo(() => {
    const filterPlanetsByText = (filterString: string) => {
      const tmpPlanets = planets ?? [];

      setFilteredPlanets(tmpPlanets.filter((planet) => planet.name.toLowerCase().includes(
        filterString.toLowerCase(),
      )));
    };

    const filterPlanetsByKey = (
      key: keyof TipoDePlanetaSemResidentes,
      operator: FraseOperador,
      compareValue: number,
    ) => {
      setFilters((currState) => [...currState, { key, operator, compareValue }]);
    };

    const removeFilter = (key: string) => setFilters((currState) => currState.filter(
      (filter) => filter.key !== key,
    ));

    const sortList = (key: keyof TipoDePlanetaSemResidentes, order: 'asc' | 'desc') => {
      setFilteredPlanets((currState) => sortByKey(currState ?? [], key, order));
    };

    const removeAllFilters = () => setFilters([]);

    return {
      planets: filteredPlanets,
      isLoading,
      isError,
      errorMsg,
      filters,
      availableFilters,
      filterPlanetsByText,
      filterPlanetsByKey,
      removeFilter,
      removeAllFilters,
      sortList,
    };
  }, [isLoading, isError, errorMsg, filteredPlanets, planets, availableFilters, filters]);

  return (
    <PlanetContext.Provider value={ contextValue }>
      { children }
    </PlanetContext.Provider>
  );
}
