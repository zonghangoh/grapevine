import { NavigateFunction } from 'react-router-dom';

interface AuthFetchOptions extends RequestInit {
  navigate?: NavigateFunction;
}

export const authFetch = async (
  endpoint: string,
  options: AuthFetchOptions = {}
) => {
  const { navigate, ...fetchOptions } = options;
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const url = `${apiUrl}${endpoint}`;

  const finalOptions: RequestInit = {
    credentials: 'include',
    ...fetchOptions,
  };

  const response = await fetch(url, finalOptions);

  if (response.status === 401) {
    if (navigate) {
      navigate('/');
    } else {
      window.location.href = '/';
    }

    window.alert("Unauthorized");
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const  { error } = await response.json()
    window.alert(error);
    throw new Error(error);
  }

  return await response.json();
};