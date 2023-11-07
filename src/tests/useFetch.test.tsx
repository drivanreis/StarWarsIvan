// Eu sou Naviivan, um Jedi iniciante.
// E vou tentar deixar o código o mais bem explicado possível,
// com a maioria das variáveis em português.

// Importação das bibliotecas e configurações necessárias para os testes
import { vi } from 'vitest'; // Importa a biblioteca de testes personalizada
import { testData } from './mock/testData'; // Dados de teste para simular a resposta da API
import { renderHook, waitFor } from '@testing-library/react'; // Renderização de hooks para testes
import { useFetch } from '../hooks/useFetch'; // Hook a ser testado

// Testes para o hook useFetch
describe('Test the useFetch hook', () => {
  // Limpa todos os mocks antes de cada teste
  beforeEach(() => vi.clearAllMocks());

  const END_POINT = 'https://swapi.dev/api/planets'; // URL do ponto final

  // Teste para verificar se o useFetch faz a chamada com o endpoint correto
  test('teste se useFetch chama busca com endpoint correto', async () => {
    // Configuração do mock para o fetch com dados de teste
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => (testData),
    });

    // Renderiza o hook e verifica se está carregando
    const { result } = renderHook(() => useFetch(END_POINT));
    expect(result.current.isLoading).toBe(true);

    // Aguarda a finalização do carregamento e verifica os resultados
    await waitFor(() => {
      const currHookReturn = result.current;
      expect(currHookReturn.isLoading).toBe(false);
    }, { timeout: 5000 });

    // Verifica se o fetch foi chamado com o endpoint correto
    expect(global.fetch).toHaveBeenCalledWith(END_POINT);
  });

  // Teste para verificar se o useFetch lida com erros corretamente
  test('Teste se o gancho useFetch trata os erros corretamente.', async () => {
    // Configuração do mock para o fetch com um erro conhecido
    global.fetch = vi.fn().mockRejectedValue(new Error('test error'));

    // Renderiza o hook e verifica se não está carregando
    const { result } = renderHook(() => useFetch(END_POINT));
    await waitFor(async () => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });

    // Verifica se os erros são tratados corretamente
    const currHookReturn = result.current;
    expect(currHookReturn.isError).toBe(true);
    expect(currHookReturn.errorMsg).toBe('test error');
  });

  // Teste para verificar se o useFetch lida com erros desconhecidos corretamente
  test('Teste se o gancho useFetch lida corretamente com erros desconhecidos.', async () => {
    // Configuração do mock para o fetch com um erro desconhecido
    global.fetch = vi.fn().mockRejectedValue({});

    // Renderiza o hook e verifica se não está carregando
    const { result } = renderHook(() => useFetch(END_POINT));
    await waitFor(async () => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });

    // Verifica se os erros desconhecidos são tratados corretamente
    const currHookReturn = result.current;
    expect(currHookReturn.isError).toBe(true);
    expect(currHookReturn.errorMsg).toBe('Unknown error');
  });
});
