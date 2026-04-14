export const useApi = <T>(url: string, options: any = {}) => {
  const { public: { apiBase } } = useRuntimeConfig()
  const token = useCookie('auth_token')

  const defaults = {
    baseURL: apiBase,
    key: url,
    headers: token.value
      ? { Authorization: `Bearer ${token.value}` }
      : {},
  }

  // Merge options with defaults
  return useFetch<T>(url, { ...defaults, ...options })
}
