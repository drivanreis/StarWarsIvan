// Eu sou Naviivan, um Jedi iniciante.
// E vou tentar deixar o código o mais bem explicado possível,
// com a maioria das variáveis em português.

import { useCallback, useEffect, useState } from 'react';

export function useFetch<T, S>(url: string, middleware?: (data: T) => S) {
  const [data, setData] = useState<S | T | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Função para realizar a requisição e atualizar os estados correspondentes
  const makeRequest = useCallback((makeRequestUrl: string) => {
    setLoading(true);
    fetch(makeRequestUrl)
      .then((response) => response.json())
      .then((responseJson: T) => {
        if (middleware) setData(middleware(responseJson));
        else setData(responseJson);
      })
      .catch((error) => {
        setError(true);
        if (error instanceof Error) setErrorMsg(error.message);
        // else setErrorMsg('Erro desconhecido');
        else setErrorMsg('Unknown error');
      })
      .finally(() => setLoading(false));
  }, [middleware]);

  // Disparar a requisição ao carregar o componente
  useEffect(() => {
    makeRequest(url);
  }, [makeRequest, url]);

  return {
    // Dados da requisição
    data,
    // Indicação se está carregando
    isLoading,
    // Indicação se houve erro
    isError,
    // Mensagem de erro
    errorMsg,
    // Função para fazer requisição manualmente
    makeRequest,
  };
}
