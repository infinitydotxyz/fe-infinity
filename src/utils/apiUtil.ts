import axios, { AxiosInstance } from 'axios';
// import { errorToast } from 'components/Toast/Toast';
import qs from 'query-string';
import { API_BASE } from './constants';
import { ProviderManager } from './providers/ProviderManager';

const errorToast = (message: string) => {
  console.log(message);
};

const axiosApi: AxiosInstance = axios.create({
  headers: {}
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function dummyFetch(mockData = []) {
  await sleep(1000);
  return mockData;
}

const catchError = (err: any) => {
  console.error('catchError', err, err?.response);
  return { error: { message: typeof err === 'object' ? err?.message : err }, status: err?.response?.status };
};

export const getAuthHeaders = async (attemptLogin = true) => {
  const providerManager = await ProviderManager.getInstance();
  const authHeaders = await providerManager.getAuthHeaders(attemptLogin);
  return authHeaders;
};

export const apiGet = async (path: string, query?: any, options?: any, doNotAttemptLogin?: boolean) => {
  const queryStr = query ? '?' + qs.stringify(query) : '';
  try {
    const userEndpointRegex = /\/u\//;
    const publicUserEndpoint = /\/p\/u\//;
    const requiresAuth = userEndpointRegex.test(path) && !publicUserEndpoint.test(path);

    let authHeaders = {};
    if (requiresAuth) {
      const attemptLogin = !doNotAttemptLogin;
      authHeaders = await getAuthHeaders(attemptLogin);
    }

    const { data, status } = await axiosApi({
      url: path.startsWith('http') ? path : `${API_BASE}${path}${queryStr}`,
      method: 'GET',
      headers: authHeaders,
      ...options
    });
    return { result: data, status };
  } catch (err: any) {
    const { error, status } = catchError(err);
    if (status === 401) {
      errorToast('Unauthorized');
      return { error: new Error('Unauthorized'), status };
    }
    return { error, status };
  }
};

export const apiPost = async (path: string, query?: any, payload?: any) => {
  const queryStr = query ? '?' + qs.stringify(query) : '';
  const headers = await getAuthHeaders();

  try {
    const { data, status } = await axiosApi({
      url: `${API_BASE}${path}${queryStr}`,
      method: 'POST',
      headers,
      data: payload
    });

    return { result: data, status };
  } catch (err: any) {
    const { error, status } = catchError(err);
    if (status === 429) {
      errorToast("You've been rate limited, please try again in a few minutes");
    }
    return { error, status };
  }
};

export const apiDelete = async (path: string, query?: any) => {
  const queryStr = query ? '?' + qs.stringify(query) : '';
  const headers = await getAuthHeaders();

  try {
    const { data, status } = await axiosApi({
      url: `${API_BASE}${path}${queryStr}`,
      method: 'DELETE',
      headers
    });
    return { result: data, status };
  } catch (err: any) {
    const { error, status } = catchError(err);
    return { error, status };
  }
};
