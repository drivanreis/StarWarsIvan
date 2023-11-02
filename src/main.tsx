// Eu sou Naviivan, um Jedi iniciante.
// E vou tentar deixar o código o mais bem explicado possível,
// com a maioria das variáveis em português.

import ReactDOM from 'react-dom/client';
import App from './App';
import { ProvedorContextoPlanetas } from './context/PlanetContext';

ReactDOM
  .createRoot(document.getElementById('root') as HTMLElement)
  .render(
    <ProvedorContextoPlanetas>
      <App />
    </ProvedorContextoPlanetas>,
  );
