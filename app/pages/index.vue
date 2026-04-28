<script setup lang="ts">
import { LoginSchema, type LoginInput } from "../schemas/auth";

const auth = useAuthStore();
const toast = useToast();

const user = reactive<LoginInput>({
  email: "",
  password: "",
});

const showPassword = ref(false);

definePageMeta({
  layout: false,
  middleware: "guest",
});

const handleLogin = async () => {
  const loginToast = toast.add({
    id: "loading",
    title: "Mohon tunggu",
    description: "Sedang proses login ...",
    icon: "i-lucide-loader-circle",
    duration: 0,
    close: false,
    ui: {
      icon: "animate-spin",
    },
  });
  try {
    const response: any = await useApi("/login", {
      method: "POST",
      body: user,
    });

    auth.setAuth(response.user, response.access_token);
    toast.update("loading", {
      title: "Login Berhasil",
      description: "Selamat datang di Simpeg App",
      color: "success",
      icon: "i-lucide-check",
      duration: 1000,
      ui: {
        icon: "",
      },
    });
    navigateTo("/dashboard");
  } catch (error) {
    console.log(error);
    toast.update("loading", {
      title: "Login Gagal",
      description: "Username atau password salah",
      color: "error",
      icon: "i-lucide-x",
      duration: 1000,
      ui: {
        icon: "",
      },
    });
  }
};
</script>

<template>
  <div
    class="flex items-center justify-center min-h-[calc(100vh-64px)] relative w-full overflow-hidden"
  >
    <!-- Login Card -->
    <div
      class="w-full max-w-md p-8 relative z-10 bg-white dark:bg-gray-900 shadow-2xl rounded-[2.5rem] border border-gray-200 dark:border-gray-800 mx-4 transition-all duration-500"
    >
      <!-- App Header / Logo inside Card -->
      <div class="text-center mb-10">
        <div class="mb-6">
          <img
            src="/simpeg-logo.png"
            alt="Simpeg Logo"
            class="w-20 h-20 object-contain relative z-10 drop-shadow-2xl mx-auto"
          />
        </div>
        <h1
          class="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2"
        >
          Simpeg App
        </h1>
      </div>

      <!-- Login Form -->
      <UForm
        :schema="LoginSchema"
        :state="user"
        @submit.prevent="handleLogin"
        class="space-y-6"
      >
        <!-- Email -->
        <UFormField
          label="Email"
          name="email"
          :ui="{
            label:
              'font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1',
          }"
        >
          <UInput
            v-model="user.email"
            icon="i-lucide-mail"
            placeholder="Email anda"
            size="xl"
            color="neutral"
            variant="outline"
            class="w-full rounded-2xl"
          />
        </UFormField>

        <!-- Password -->
        <UFormField
          label="Password"
          name="password"
          :ui="{
            label:
              'font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1',
          }"
        >
          <UInput
            v-model="user.password"
            :type="showPassword ? 'text' : 'password'"
            icon="i-lucide-lock"
            placeholder="••••••••"
            size="xl"
            color="neutral"
            variant="outline"
            class="w-full rounded-2xl"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="ghost"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :padded="false"
                class="hover:bg-transparent mr-2"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>

        <!-- Submit Button -->
        <div class="pt-4">
          <UButton
            type="submit"
            block
            size="xl"
            class="w-full justify-center bg-green-500 hover:bg-green-600 rounded-2xl text-white font-black text-lg py-4 transition-all transform active:scale-[0.97] shadow-xl shadow-green-500/20 border-0"
          >
            MASUK SEKARANG
          </UButton>
        </div>
      </UForm>

      <!-- Extra Footer -->
      <div class="mt-10 text-center">
        <p
          class="text-xs text-gray-400 dark:text-gray-600 font-medium tracking-tight"
        >
          Sistem Informasi Kepegawaian Internal &copy;
          {{ new Date().getFullYear() }}
        </p>
      </div>
    </div>
  </div>
</template>
