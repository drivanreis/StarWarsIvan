import { useCallback, useContext, useRef, useState } from 'react';
import { PlanetContext } from '../context/PlanetContext';
import { OperatorPhrase, PlanetTypeWithoutResidents } from '../types';

function Search() {
  const [numInputValue, setNumInputValue] = useState('0');
  const [checValue, setChecValue] = useState('');
  const {
    filterPlanetsByText,
    filterPlanetsByKey,
    sortList,
    removeFilter,
    removeAllFilters,
    filters,
    availableFilters,
  } = useContext(PlanetContext);

  const columnFilterRef = useRef<HTMLSelectElement>(null);
  const comparisonFilterRef = useRef<HTMLSelectElement>(null);
  const columnSortRef = useRef<HTMLSelectElement>(null);

  const hChangeFilter = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    filterPlanetsByText(event.target.value);
  }, [filterPlanetsByText]);

  const hClickFilter = useCallback(() => {
    const columnFilterEl = columnFilterRef.current;
    const comparisonFilterEl = comparisonFilterRef.current;

    if (columnFilterEl && comparisonFilterEl) {
      const columnFilterValue = columnFilterEl.value as keyof PlanetTypeWithoutResidents;
      const comparisonValue = comparisonFilterEl.value as OperatorPhrase;

      if (columnFilterValue) {
        filterPlanetsByKey(columnFilterValue, comparisonValue, Number(numInputValue));
      }
    }
  }, [filterPlanetsByKey, numInputValue]);

  const hChangeCompareValue = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    setNumInputValue(event.target.value);
  }, []);

  const hChangeRadio = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setChecValue(event.target.value);
  }, []);

  const hSort = useCallback(() => {
    const columnSortEl = columnSortRef.current;

    sortList(
      columnSortEl?.value as keyof PlanetTypeWithoutResidents,
      checValue.toLowerCase() as 'asc' | 'desc',
    );
  }, [checValue, sortList]);

  return (
    <div>
      <div>
        <input
          data-testid="name-filter"
          aria-label="name filter"
          type="text"
          onChange={ hChangeFilter }
        />
      </div>

      <div>
        <select
          data-testid="column-filter"
          ref={ columnFilterRef }
          aria-label="column filter"
        >
          {availableFilters.map((filter) => <option key={ filter }>{ filter }</option>)}
        </select>

        <select
          data-testid="comparison-filter"
          ref={ comparisonFilterRef }
          aria-label="operation"
        >
          <option>maior que</option>
          <option>menor que</option>
          <option>igual a</option>
        </select>

        <input
          type="number"
          data-testid="value-filter"
          aria-label="value for filter"
          min={ 0 }
          value={ numInputValue }
          onChange={ hChangeCompareValue }
        />

        <button
          data-testid="button-filter"
          onClick={ hClickFilter }
        >
          Filtrar
        </button>
        <button data-testid="button-remove-filters" onClick={ removeAllFilters }>
          Remover todas filtragens
        </button>
      </div>

      <div>
        <select data-testid="column-sort" ref={ columnSortRef } aria-label="column sort">
          <option>population</option>
          <option>orbital_period</option>
          <option>diameter</option>
          <option>rotation_period</option>
          <option>surface_water</option>
        </select>

        <label htmlFor="asc">Ascendente</label>
        <input
          type="radio"
          value="asc"
          id="asc"
          name="sort"
          checked={ checValue === 'asc' }
          onChange={ hChangeRadio }
          data-testid="column-sort-input-asc"
        />

        <label htmlFor="desc">Descendente</label>
        <input
          type="radio"
          value="desc"
          id="desc"
          name="sort"
          data-testid="column-sort-input-desc"
          checked={ checValue === 'desc' }
          onChange={ hChangeRadio }
        />

        <button
          onClick={ hSort }
          data-testid="column-sort-button"
        >
          Ordenar
        </button>
      </div>

      <div>
        {
          filters.map((filter) => (
            <div key={ filter.key } data-testid="filter">
              <span>{filter.key}</span>
              {' '}
              <button onClick={ () => removeFilter(filter.key) }>X</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Search;
