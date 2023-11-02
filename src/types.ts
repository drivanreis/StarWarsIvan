// Eu sou Naviivan, um Jedi iniciante.
// E vou tentar deixar o código o mais bem explicado possível,
// com a maioria das variáveis em português.

export type TipoPlaneta = {
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

export type TipoDePlanetaSemResidentes = Omit<TipoPlaneta, 'residents'>;

export type RespostaAPI = {
  count: number;
  next: string | null;
  previous: null | string;
  results: TipoPlaneta[];
};

export type FraseOperador = 'maior que' | 'menor que' | 'igual a';

export type TipoDeFiltro = {
  key: keyof TipoDePlanetaSemResidentes,
  operator: FraseOperador,
  compareValue: number,
};

export type TipoContextoPlaneta = {
  planets: TipoDePlanetaSemResidentes[] | null;
  isLoading: boolean;
  isError: boolean;
  errorMsg: string;
  availableFilters: string[];
  filters: TipoDeFiltro[];
  filterPlanetsByText: (filterString: string) => void;
  filterPlanetsByKey: (
    key: keyof TipoDePlanetaSemResidentes,
    operator: FraseOperador,
    compareValue: number,
  ) => void;
  removeFilter: (key: string) => void;
  removeAllFilters: () => void;
  sortList: (key: keyof TipoDePlanetaSemResidentes, order: 'asc' | 'desc') => void;
};
