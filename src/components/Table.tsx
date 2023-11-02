// Eu sou Naviivan, um Jedi iniciante.
// E vou tentar deixar o código o mais bem explicado possível,
// com a maioria das variáveis em português.

import React, { useContext } from 'react';
import { PlanetContext } from '../context/PlanetContext';

function Table() {
  // Acessando os dados 'planets' do PlanetContext
  const { planets } = useContext(PlanetContext);

  // Cabeçalhos da tabela com chaves respectivas
  const headers = [
    { name: 'Nome', apiKey: 'name' },
    { name: 'Período de Rotação', apiKey: 'rotation_period' },
    { name: 'Período Orbital', apiKey: 'orbital_period' },
    { name: 'Diâmetro', apiKey: 'diameter' },
    { name: 'Clima', apiKey: 'climate' },
    { name: 'Gravidade', apiKey: 'gravity' },
    { name: 'Terreno', apiKey: 'terrain' },
    { name: 'Água Superficial', apiKey: 'surface_water' },
    { name: 'População', apiKey: 'population' },
    { name: 'Filmes', apiKey: 'films' },
    { name: 'Criado', apiKey: 'created' },
    { name: 'Editado', apiKey: 'edited' },
    { name: 'URL', apiKey: 'url' },
  ];

  return (
    <div>
      <table>
        <thead>
          <tr>
            {/* Mapeando os cabeçalhos para criar células de cabeçalho da tabela */}
            {headers.map(({ name }) => <th key={ name }>{name}</th>)}
          </tr>
        </thead>
        <tbody>
          {planets?.map((planet, index) => (
            <tr key={ index }>
              {/* Mapeando os cabeçalhos para criar células da tabela com os dados respectivos */}
              {headers.map(({ apiKey }) => (
                <td
                  key={ apiKey }
                  data-testid={ apiKey === 'name' ? 'planet-name' : '' }
                >
                  {/* Acessando os dados do planeta com base na chave da API correspondente */}
                  {planet[apiKey as keyof typeof planet]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
