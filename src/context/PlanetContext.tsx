import { createContext, useEffect, useMemo, useState } from 'react';
import {
  ApiResponse,
  FilterType,
  OperatorPhrase,
  PlanetContextType,
  PlanetTypeWithoutResidents,
} from '../types';
import { useFetch } from '../hooks/useFetch';

export const PlanetContext = createContext({} as PlanetContextType);

const removeResidentsMiddleware = (data: ApiResponse) => {
  return data.results.map((planet) => {
    const { residents, ...planetWithoutResidents } = planet;
    return planetWithoutResidents;
  });
};

const sortByKey = (
  list: PlanetTypeWithoutResidents[],
  key: keyof PlanetTypeWithoutResidents,
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

export function PlanetContextProvider({ children }: { children: React.ReactNode }) {
  const {
    data: planetsWithOutResidents,
    isLoading,
    isError,
    errorMsg,
  } = useFetch<ApiResponse, PlanetTypeWithoutResidents[]>('https://swapi.dev/api/planets', removeResidentsMiddleware);

  const planets = planetsWithOutResidents as PlanetTypeWithoutResidents[] | null;

  const [filteredPlanets, setFilteredPlanets] = useState(planets);
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [availableFilters, setAvailableFilters] = useState<string[]>(INITIAL_FILTERS);

  useEffect(() => {
    setFilteredPlanets(planets);
  }, [planets]);

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

  const contextValue = useMemo(() => {
    const filterPlanetsByText = (filterString: string) => {
      const tmpPlanets = planets ?? [];

      setFilteredPlanets(tmpPlanets.filter((planet) => planet.name.toLowerCase().includes(
        filterString.toLowerCase(),
      )));
    };

    const filterPlanetsByKey = (
      key: keyof PlanetTypeWithoutResidents,
      operator: OperatorPhrase,
      compareValue: number,
    ) => {
      setFilters((currState) => [...currState, { key, operator, compareValue }]);
    };

    const removeFilter = (key: string) => setFilters((currState) => currState.filter(
      (filter) => filter.key !== key,
    ));

    const sortList = (key: keyof PlanetTypeWithoutResidents, order: 'asc' | 'desc') => {
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
