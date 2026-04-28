<script setup>
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "id",
    class: "antialiased",
  },
});

useSeoMeta({
  title: "Simpeg App",
  description: "Sistem Informasi Kepegawaian",
});
const auth = useAuthStore();
</script>

<template>
  <UApp>
    <div class="min-h-screen transition-colors duration-300">
      <UHeader :toggle="false">
        <template #title>
          <div class="flex items-center gap-3 group">
            <img
              src="/simpeg-logo.png"
              alt="Simpeg Logo"
              class="w-10 h-10 object-contain relative z-10 drop-shadow-2xl"
            />
            Simpeg App
          </div>
        </template>

        <template #right>
          <UColorModeButton />
          <UButton
            v-if="auth.isAuthenticated"
            icon="i-lucide-log-out"
            color="error"
            variant="ghost"
            @click="auth.logout"
          />
        </template>
      </UHeader>

      <UMain>
        <NuxtPage />
      </UMain>
    </div>
  </UApp>
</template>
