export const useAuth = () => {
  const user = useState<any | null>('auth_user', () => null)
  const token = useCookie('auth_token')
  const { public: { apiBase } } = useRuntimeConfig()

  const isLoggedIn = computed(() => !!token.value)

  async function fetchUser() {
    if (!token.value) {
      user.value = null
      return
    }

    try {
      const data = await $fetch<any>(`${apiBase}/users/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      user.value = data
    } catch (error) {
      console.error('Failed to fetch user:', error)
      user.value = null
      token.value = null // Clear invalid token
    }
  }

  function logout() {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  return {
    user,
    isLoggedIn,
    fetchUser,
    logout
  }
}
