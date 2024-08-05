import axios from 'axios';

export function useHttp() {
  const apiProto = import.meta.env.API_PROTO ?? 'http';
  const apiHost = import.meta.env.API_HOST;
  const apiPort = import.meta.env.API_PORT;
  const apiTimeout = import.meta.env.API_TIMEOUT ? Number(import.meta.env.API_TIMEOUT) : 2500;

  axios.defaults.baseURL = `${apiProto}://${apiHost}:${apiPort}`;
  axios.defaults.timeout = Number(apiTimeout);
  return {
    get: axios.get,
    post: axios.post,
    patch: axios.patch,
    delete: axios.delete,
  };
}
