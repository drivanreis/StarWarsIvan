// Eu sou Naviivan, um Jedi iniciante.
// E vou tentar deixar o código o mais bem explicado possível,
// com a maioria das variáveis em português.

import React, { useCallback, useContext, useRef, useState } from 'react';
import { PlanetContext } from '../context/PlanetContext';
import { FraseOperador, TipoDePlanetaSemResidentes } from '../types';

function Search() {
  // Variáveis de estado usando o hook useState
  const [numInputValue, setNumInputValue] = useState('0');
  const [checValue, setChecValue] = useState('');

  // Destruturando funções e estados necessários do PlanetContext usando useContext
  const {
    filterPlanetsByText,
    filterPlanetsByKey,
    sortList,
    removeFilter,
    removeAllFilters,
    filters,
    availableFilters,
  } = useContext(PlanetContext);

  // Refs para elementos select
  const columnFilterRef = useRef<HTMLSelectElement>(null);
  const comparisonFilterRef = useRef<HTMLSelectElement>(null);
  const columnSortRef = useRef<HTMLSelectElement>(null);

  // Função de retorno de chamada para lidar com alterações de entrada de texto
  const hTFiltraMuda = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    filterPlanetsByText(event.target.value);
  }, [filterPlanetsByText]);

  // Função de retorno de chamada para lidar com clique no botão de filtro
  const hFiltraClick = useCallback(() => {
    const columnFilterEl = columnFilterRef.current;
    const comparisonFilterEl = comparisonFilterRef.current;

    if (columnFilterEl && comparisonFilterEl) {
      const columnFilterValue = columnFilterEl.value as keyof TipoDePlanetaSemResidentes;
      const comparisonValue = comparisonFilterEl.value as FraseOperador;

      if (columnFilterValue) {
        filterPlanetsByKey(columnFilterValue, comparisonValue, Number(numInputValue));
      }
    }
  }, [filterPlanetsByKey, numInputValue]);

  // Função de retorno de chamada para alterar o valor de comparação
  const hComparaValorMuda = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setNumInputValue(event.target.value);
  }, []);

  // Função de retorno de chamada para lidar com alterações nos botões de rádio
  const hRadioMuda = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setChecValue(event.target.value);
  }, []);

  // Função de retorno de chamada para lidar com clique no botão de classificação
  const hOrdem = useCallback(() => {
    const columnSortEl = columnSortRef.current;

    sortList(
      columnSortEl?.value as keyof TipoDePlanetaSemResidentes,
      checValue.toLowerCase() as 'asc' | 'desc',
    );
  }, [checValue, sortList]);

  return (
    <div>
      <div>
        {/* Entrada para filtrar por texto */}
        <input
          data-testid="name-filter"
          aria-label="name filter"
          type="text"
          onChange={ hTFiltraMuda }
        />
      </div>

      <div>
        {/* Elementos select para filtragem */}
        <select
          data-testid="column-filter"
          ref={ columnFilterRef }
          aria-label="column filter"
        >
          {availableFilters.map((filter) => (
            <option key={ filter }>{filter}</option>
          ))}
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
          onChange={ hComparaValorMuda }
        />

        <button
          data-testid="button-filter"
          onClick={ hFiltraClick }
        >
          Filtrar
        </button>
        <button data-testid="button-remove-filters" onClick={ removeAllFilters }>
          Remover todas filtragens
        </button>
      </div>

      <div>
        {/* Elemento select e botões de rádio para classificação */}
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
          onChange={ hRadioMuda }
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
          onChange={ hRadioMuda }
        />

        <button
          onClick={ hOrdem }
          data-testid="column-sort-button"
        >
          Ordenar
        </button>
      </div>

      <div>
        {/* Exibindo filtros aplicados */}
        {filters.map((filter) => (
          <div key={ filter.key } data-testid="filter">
            <span>{filter.key}</span>
            {' '}
            <button onClick={ () => removeFilter(filter.key) }>X</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
