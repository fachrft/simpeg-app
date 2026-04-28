<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const pegawai = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const config = useRuntimeConfig();

const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const fetchDetail = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const res: any = await useApi(`/pegawai/${id}`, { method: "GET" });
    pegawai.value = res.data;
  } catch (err: any) {
    error.value = "Gagal memuat data pegawai.";
  } finally {
    isLoading.value = false;
  }
};

const handleEditSuccess = () => {
  fetchDetail();
};

const handleDeleteSuccess = () => {
  router.push("/dashboard");
};

onMounted(fetchDetail);

const fotoUrl = computed(() => {
  if (!pegawai.value?.foto) return null;
  const baseUrl = config.public.apiBase.replace(/\/api$/, "");
  const fotoPath = pegawai.value.foto.replace(/^storage\//, "");
  return `${baseUrl}/storage/${fotoPath}`;
});

const inisial = computed(() => {
  if (!pegawai.value?.nama) return "?";
  return pegawai.value.nama
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();
});

useSeoMeta({
  title: computed(() =>
    pegawai.value ? `Detail - ${pegawai.value.nama}` : "Detail Pegawai",
  ),
});

type InfoItem = {
  label: string;
  value: string | null | undefined;
  icon: string;
};

const infoSections = computed<
  { title: string; icon: string; items: InfoItem[] }[]
>(() => {
  if (!pegawai.value) return [];
  const p = pegawai.value;
  return [
    {
      title: "Informasi Pribadi",
      icon: "i-lucide-user",
      items: [
        { label: "NIP", value: p.nip, icon: "i-lucide-id-card" },
        { label: "Nama Lengkap", value: p.nama, icon: "i-lucide-user" },
        {
          label: "Jenis Kelamin",
          value: p.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
          icon: "i-lucide-users",
        },
        {
          label: "Tempat Lahir",
          value: p.tempat_lahir,
          icon: "i-lucide-map-pin",
        },
        {
          label: "Tanggal Lahir",
          value: p.tanggal_lahir,
          icon: "i-lucide-calendar",
        },
        { label: "Agama", value: p.agama, icon: "i-lucide-heart" },
        { label: "Alamat", value: p.alamat, icon: "i-lucide-home" },
      ],
    },
    {
      title: "Informasi Kepegawaian",
      icon: "i-lucide-briefcase",
      items: [
        { label: "Jabatan", value: p.jabatan, icon: "i-lucide-briefcase" },
        {
          label: "Unit Kerja",
          value: p.unit_kerja?.nama_unit ?? "-",
          icon: "i-lucide-building-2",
        },
        { label: "Eselon", value: p.eselon, icon: "i-lucide-layers" },
        {
          label: "Golongan",
          value: p.golongan?.nama_golongan ?? "-",
          icon: "i-lucide-award",
        },
        {
          label: "TMT Tugas",
          value: p.tempat_tugas,
          icon: "i-lucide-calendar-check",
        },
      ],
    },
    {
      title: "Kontak & Administrasi",
      icon: "i-lucide-phone",
      items: [
        { label: "No. HP", value: p.no_hp, icon: "i-lucide-phone" },
        { label: "NPWP", value: p.npwp, icon: "i-lucide-file-text" },
      ],
    },
  ];
});
</script>

<template>
  <UContainer class="py-8 md:py-10 min-h-screen">
    <!-- Back Button & Header -->
    <div class="flex items-center gap-3 mb-8">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        class="rounded-full"
        @click="router.back()"
      />
      <div>
        <h1
          class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
        >
          Detail Pegawai
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Informasi lengkap data kepegawaian
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-32">
      <div class="flex flex-col items-center gap-4">
        <UIcon
          name="i-lucide-loader-circle"
          class="h-10 w-10 animate-spin text-primary"
        />
        <span class="text-gray-500">Memuat data pegawai...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center py-32">
      <div class="flex flex-col items-center gap-4 text-center">
        <UIcon name="i-lucide-alert-circle" class="h-12 w-12 text-red-500" />
        <p class="text-gray-700 dark:text-gray-300 font-medium">{{ error }}</p>
        <UButton
          label="Coba Lagi"
          icon="i-lucide-refresh-cw"
          @click="fetchDetail"
        />
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="pegawai" class="space-y-6">
      <!-- Profile Card -->
      <div
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden"
      >
        <!-- Profile Info -->
        <div class="p-6">
          <div
            class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 -mt-12"
          >
            <!-- Foto / Inisial -->
            <div class="shrink-0">
              <div
                v-if="fotoUrl"
                class="h-20 w-20 rounded-full border-4 border-white dark:border-gray-900 shadow-md overflow-hidden"
              >
                <img
                  :src="fotoUrl"
                  alt="Foto Pegawai"
                  class="h-full w-full object-cover"
                />
              </div>
              <div
                v-else
                class="h-20 w-20 rounded-full border-4 border-white dark:border-gray-900 shadow-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
              >
                <span
                  class="text-2xl font-bold text-primary-600 dark:text-primary-300"
                >
                  {{ inisial }}
                </span>
              </div>
            </div>

            <!-- Name & Badge -->
            <div class="flex-1 sm:pb-2">
              <h2
                class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight"
              >
                {{ pegawai.nama }}
              </h2>
              <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                {{ pegawai.jabatan ?? "—" }}
              </p>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <UBadge
                  :label="
                    pegawai.unit_kerja?.nama_unit ?? 'Unit Tidak Diketahui'
                  "
                  color="primary"
                  variant="soft"
                  size="sm"
                />
                <UBadge
                  :label="pegawai.golongan?.nama_golongan ?? '-'"
                  color="neutral"
                  variant="soft"
                  size="sm"
                />
                <UBadge
                  :label="pegawai.status_pegawai ?? 'Aktif'"
                  color="success"
                  variant="soft"
                  size="sm"
                />
              </div>
            </div>
            <!-- Actions -->
            <div class="flex items-center gap-2">
              <UButton
                icon="i-lucide-edit"
                label="Edit"
                color="secondary"
                variant="soft"
                size="sm"
                class="rounded-lg"
                @click="isEditModalOpen = true"
              />
              <UButton
                icon="i-lucide-trash-2"
                label="Hapus"
                color="error"
                variant="soft"
                size="sm"
                class="rounded-lg"
                @click="isDeleteModalOpen = true"
              />
            </div>
          </div>

          <!-- NIP -->
          <div
            class="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
          >
            <UIcon name="i-lucide-id-card" class="h-4 w-4" />
            <span>NIP:</span>
            <span
              class="font-mono font-semibold text-gray-800 dark:text-gray-100"
            >
              {{ pegawai.nip }}
            </span>
          </div>
        </div>
      </div>

      <!-- Info Sections Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="section in infoSections"
          :key="section.title"
          class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm p-6 md:p-8 relative overflow-hidden group hover:border-primary-100 dark:hover:border-primary-900/50 transition-colors duration-300"
        >
          <!-- Section Header -->
          <div class="flex items-center gap-3 mb-6 md:mb-8 relative z-10">
            <UIcon
              :name="section.icon"
              class="h-5 w-5 text-primary-600 dark:text-primary-400"
            />

            <h3
              class="font-bold text-gray-900 dark:text-white text-lg tracking-tight"
            >
              {{ section.title }}
            </h3>
          </div>

          <!-- Items -->
          <div class="space-y-5 relative z-10">
            <div
              v-for="item in section.items"
              :key="item.label"
              class="flex flex-col gap-1.5"
            >
              <div
                class="flex items-center gap-2 text-gray-500 dark:text-gray-400"
              >
                <UIcon :name="item.icon" class="h-4 w-4 shrink-0" />
                <span class="text-[11px] font-bold uppercase">
                  {{ item.label }}
                </span>
              </div>
              <span
                class="text-[15px] font-medium text-gray-900 dark:text-white"
              >
                {{ item.value ?? "—" }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <DashboardModalEditPegawai
      v-if="pegawai"
      v-model="isEditModalOpen"
      :pegawai="pegawai"
      @success="handleEditSuccess"
    />
    <DashboardModalHapusPegawai
      v-if="pegawai"
      v-model="isDeleteModalOpen"
      :pegawai="pegawai"
      @success="handleDeleteSuccess"
    />
  </UContainer>
</template>
