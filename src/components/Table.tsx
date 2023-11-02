import { useContext } from 'react';
import { PlanetContext } from '../context/PlanetContext';

function Table() {
  const { planets } = useContext(PlanetContext);

  const headers = [
    { name: 'Name', apiKey: 'name' },
    { name: 'Rotation Period', apiKey: 'rotation_period' },
    { name: 'Orbital Period', apiKey: 'orbital_period' },
    { name: 'Diameter', apiKey: 'diameter' },
    { name: 'Climate', apiKey: 'climate' },
    { name: 'Gravity', apiKey: 'gravity' },
    { name: 'Terrain', apiKey: 'terrain' },
    { name: 'Surface Water', apiKey: 'surface_water' },
    { name: 'Population', apiKey: 'population' },
    { name: 'Films', apiKey: 'films' },
    { name: 'Created', apiKey: 'created' },
    { name: 'Edited', apiKey: 'edited' },
    { name: 'URL', apiKey: 'url' },
  ];

  return (
    <div>
      <table>
        <thead>
          <tr>
            {headers.map(({ name }) => <th key={ name }>{name}</th>)}
          </tr>
        </thead>
        <tbody>
          {planets?.map((planet, index) => (
            <tr key={ index }>
              {headers.map(({ apiKey }) => (
                <td
                  key={ apiKey }
                  data-testid={ apiKey === 'name' ? 'planet-name' : '' }
                >
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
