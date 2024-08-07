import axios from 'axios';

export function useHttp() {
  const apiProto = import.meta.env.VITE_API_PROTO ?? 'http';
  const apiHost = import.meta.env.VITE_API_HOST;
  const apiPort = import.meta.env.VITE_API_PORT;
  const apiTimeout = import.meta.env.VITE_API_TIMEOUT
    ? Number(import.meta.env.VITE_API_TIMEOUT)
    : 2500;

  axios.defaults.baseURL = `${apiProto}://${apiHost}:${apiPort}/api`;
  console.log(axios.defaults.baseURL);
  axios.defaults.timeout = Number(apiTimeout);
  return {
    get: axios.get,
    post: axios.post,
    patch: axios.patch,
    delete: axios.delete,
  };
}
