export type PlanetType = {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
};

export type PlanetTypeWithoutResidents = Omit<PlanetType, 'residents'>;

export type ApiResponse = {
  count: number;
  next: string | null;
  previous: null | string;
  results: PlanetType[];
};

export type OperatorPhrase = 'maior que' | 'menor que' | 'igual a';

export type FilterType = {
  key: keyof PlanetTypeWithoutResidents,
  operator: OperatorPhrase,
  compareValue: number,
};

export type PlanetContextType = {
  planets: PlanetTypeWithoutResidents[] | null;
  isLoading: boolean;
  isError: boolean;
  errorMsg: string;
  availableFilters: string[];
  filters: FilterType[];
  filterPlanetsByText: (filterString: string) => void;
  filterPlanetsByKey: (
    key: keyof PlanetTypeWithoutResidents,
    operator: OperatorPhrase,
    compareValue: number,
  ) => void;
  removeFilter: (key: string) => void;
  removeAllFilters: () => void;
  sortList: (key: keyof PlanetTypeWithoutResidents, order: 'asc' | 'desc') => void;
};
