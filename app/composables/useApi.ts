export const useApi = <T>(url: string, opts?: any) => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();

  return $fetch<T>(url, {
    baseURL: config.public.apiBase,
    ...opts,
    async onRequest({ options }: any) {
      options.headers = {
        ...options.headers,
        Accept: "application/json",
      };

      if (auth.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${auth.token}`,
        };
      }
    },
    async onResponse({ response }: any) {
      if (response.status === 401) {
        auth.logout();
      }
    },
  });
};
