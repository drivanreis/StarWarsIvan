import { render } from '@testing-library/react';
import App from '../App';
import { ProvedorContextoPlanetas } from '../context/PlanetContext';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { testData } from './mock/testData';
import { vi } from 'vitest';

global.fetch = vi.fn().mockResolvedValue({
  json: async () => (testData),
});

describe('Test the App component', () => {
  it('Test if the text search work', async () => {
    const screen = render(
      <ProvedorContextoPlanetas>
        <App />
      </ProvedorContextoPlanetas>
    );

    const user = userEvent.setup();

    const nameFilterEl = screen.getByRole('textbox', {
      name: /name filter/i,
    });

    expect(nameFilterEl).toBeInTheDocument();

    await act(async () => {
      await user.type(nameFilterEl, 'tatooine');
    });

    expect(screen.getByRole('cell', { name: /tatooine/i })).toBeInTheDocument();

    await act(async () => {
      await user.clear(nameFilterEl);
      await user.type(nameFilterEl, 'Alderaan');
    });

    expect(screen.getByRole('cell', { name: /alderaan/i })).toBeInTheDocument();
  });

  it('test if the filter options work', async () => {
    const screen = render(
      <ProvedorContextoPlanetas>
        <App />
      </ProvedorContextoPlanetas>
    );

    const user = userEvent.setup();

    const columnFilter = screen.getByRole('combobox', { name: /column filter/i });
    const operation = screen.getByRole('combobox', { name: /operation/i });
    const valueFilter = screen.getByRole('spinbutton', { name: /value for filter/i });
    const btnFilter = screen.getByRole('button', { name: /filtrar/i });
    const clearAllFilters = screen.getByRole('button', { name: /remover todas filtragens/i });

    await act(async () => {
      await user.click(clearAllFilters);
      await user.selectOptions(columnFilter, 'population');
      await user.selectOptions(operation, 'igual a');
      await user.clear(valueFilter);
      await user.type(valueFilter, '200000');
      await user.click(btnFilter);
    });

    expect(columnFilter).not.toHaveValue('population');
    expect(operation).toHaveValue('igual a');
    expect(valueFilter).toHaveValue(200000);
    expect(screen.getByRole('cell', { name: /tatooine/i })).toBeInTheDocument();

    await act(async () => {
      await user.click(clearAllFilters);
      await user.selectOptions(columnFilter, 'rotation_period');
      await user.selectOptions(operation, 'maior que');
      await user.clear(valueFilter);
      await user.type(valueFilter, '26');
      await user.click(btnFilter);
    });

    expect(columnFilter).not.toHaveValue('rotation_period');
    expect(operation).toHaveValue('maior que');
    expect(valueFilter).toHaveValue(26);
    expect(screen.getByRole('cell', { name: /kamino/i })).toBeInTheDocument();
  });

  it('test the order by', async () => {
    const screen = render(
      <ProvedorContextoPlanetas>
        <App />
      </ProvedorContextoPlanetas>
    );

    const user = userEvent.setup();

    const columnSort = screen.getByRole('combobox', { name: /column sort/i });
    const risingRadio = screen.getByRole('radio', { name: /ascendente/i });
    const orderBtn = screen.getByRole('button', { name: /ordenar/i });

    await act(async () => {
      await user.selectOptions(columnSort, 'population');
      await user.click(risingRadio);
      await user.click(orderBtn);
    });

    const allPlanetsName = screen.getAllByTestId('planet-name');
    expect(allPlanetsName[0].innerHTML).toBe('Yavin IV');
  });
});
