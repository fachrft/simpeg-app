import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = useCookie("token");

  const isAuthenticated = computed(() => !!token.value);

  function setAuth(userData: any, userToken: string) {
    user.value = userData;
    token.value = userToken;
  }

  async function logout() {
    await useApi("/logout", {
      method: "POST",
    });
    user.value = null;
    token.value = null;
    navigateTo("/");
  }

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout,
  };
});
