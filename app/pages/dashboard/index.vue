<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";

useSeoMeta({
  title: "Dashboard - Simpeg App",
});

definePageMeta({
  middleware: "auth",
});

const search = ref("");
const currentPage = ref(1);
const perPage = ref(10);
const perPageOptions = [10, 25, 50, 100];

const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedPegawai = ref<any>(null);

// Filter sidebar
const isFilterOpen = ref(false);
const selectedUnitId = ref<number | null>(null);

const handleSelectUnit = (id: number | null) => {
  selectedUnitId.value = id;
  currentPage.value = 1;
  fetchPegawai();
};

const employees = ref<any[]>([]);
const totalData = ref(0);
const totalPages = ref(1);
const isLoading = ref(false);

const openAddModal = () => {
  isAddModalOpen.value = true;
};

const openEditModal = (pegawai: any) => {
  selectedPegawai.value = pegawai;
  isEditModalOpen.value = true;
};

const openDeleteModal = (pegawai: any) => {
  selectedPegawai.value = pegawai;
  isDeleteModalOpen.value = true;
};

const handleSuccess = () => {
  fetchPegawai();
};

const handlePrint = () => {
  window.print();
};

const fetchPegawai = async () => {
  isLoading.value = true;
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      per_page: perPage.value,
    };
    if (search.value) params.search = search.value;
    if (selectedUnitId.value) params.unit_kerja_id = selectedUnitId.value;

    const response: any = await useApi("/pegawai", {
      method: "GET",
      params,
    });

    employees.value = response.data.data;
    totalData.value = response.data.total;
    totalPages.value = response.data.last_page;
  } catch (error) {
    console.error("Gagal fetch data pegawai:", error);
  } finally {
    isLoading.value = false;
  }
};

let searchTimer: ReturnType<typeof setTimeout> | null = null;
watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchPegawai();
  }, 400);
});

watch(currentPage, () => {
  fetchPegawai();
});

watch(perPage, () => {
  currentPage.value = 1;
  fetchPegawai();
});

const columns = [
  { accessorKey: "no", header: "No" },
  { accessorKey: "nip", header: "NIP" },
  { accessorKey: "nama", header: "Nama" },
  { accessorKey: "tempat_lahir", header: "Tempat Lahir" },
  { accessorKey: "alamat", header: "Alamat" },
  { accessorKey: "tanggal_lahir", header: "Tgl Lahir" },
  { accessorKey: "jenis_kelamin", header: "L/P" },
  { id: "golongan", header: "Gol" },
  { accessorKey: "eselon", header: "Eselon" },
  { accessorKey: "jabatan", header: "Jabatan" },
  { accessorKey: "tempat_tugas", header: "Tempat Tugas" },
  { accessorKey: "agama", header: "Agama" },
  { id: "unit_kerja", header: "Unit Kerja" },
  { accessorKey: "no_hp", header: "No. HP" },
  { accessorKey: "npwp", header: "NPWP" },
  { id: "aksi", header: "Aksi" },
];

const tableData = computed(() =>
  employees.value.map((emp, index) => ({
    ...emp,
    no: (currentPage.value - 1) * Number(perPage.value) + index + 1,
  })),
);

const pageRange = computed(() => {
  const range: number[] = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  for (let i = start; i <= end; i++) range.push(i);
  return range;
});

fetchPegawai();
</script>

<template>
  <UContainer class="py-8 md:py-10 min-h-screen">
    <!-- Header & Actions -->
    <div
      class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
    >
      <!-- Left Side: Title & Description -->
      <div class="flex-1">
        <h1
          class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
        >
          Data Pegawai
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Manajemen data kepegawaian, cetak laporan, dan update informasi.
        </p>
      </div>

      <!-- Right Side: Search & Buttons -->
      <div class="flex flex-col items-end gap-3 mt-4 lg:mt-0">
        <!-- Search Field -->
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Cari NIP atau Nama..."
          class="w-full sm:w-[400px] rounded-lg"
        />

        <!-- Action Buttons -->
        <div class="flex items-center gap-2">
          <UButton
            :color="selectedUnitId ? 'primary' : 'success'"
            :variant="selectedUnitId ? 'soft' : 'outline'"
            icon="i-lucide-filter"
            :label="selectedUnitId ? 'Filter Aktif' : 'Filter Unit'"
            class="bg-white dark:bg-gray-900 rounded-lg"
            @click="isFilterOpen = true"
          />
          <UButton
            color="secondary"
            variant="outline"
            icon="i-lucide-printer"
            label="Cetak"
            class="bg-white dark:bg-gray-900 rounded-lg"
            @click="handlePrint"
          />
          <UButton
            color="primary"
            variant="soft"
            icon="i-lucide-plus"
            label="Tambah Pegawai"
            class="rounded-lg"
            @click="openAddModal"
          />
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div
      class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden"
    >
      <!-- Loading overlay -->
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <div class="flex flex-col items-center gap-3">
          <UIcon
            name="i-lucide-loader-circle"
            class="h-8 w-8 animate-spin text-primary"
          />
          <span class="text-sm text-gray-500">Memuat data...</span>
        </div>
      </div>

      <!-- UTable Nuxt UI -->
      <div v-else class="overflow-x-auto w-full">
        <UTable :columns="columns" :data="tableData" class="min-w-max">
          <!-- Kolom Golongan dari relasi -->
          <template #golongan-cell="{ row }">
            {{ row.original.golongan?.nama_golongan ?? "-" }}
          </template>

          <!-- Kolom Unit Kerja dari relasi -->
          <template #unit_kerja-cell="{ row }">
            {{ row.original.unit_kerja?.nama_unit ?? "-" }}
          </template>

          <!-- Custom Slot untuk Kolom Aksi -->
          <template #aksi-cell="{ row }">
            <div class="flex items-center gap-2">
              <UButton
                size="xs"
                color="neutral"
                variant="soft"
                icon="i-lucide-eye"
                label="Detail"
                class="rounded-lg"
                @click="$router.push(`/dashboard/${row.original.id}`)"
              />
              <UButton
                size="xs"
                color="info"
                variant="soft"
                icon="i-lucide-edit"
                label="Update"
                class="rounded-lg"
                @click="openEditModal(row.original)"
              />
              <UButton
                size="xs"
                color="error"
                variant="soft"
                icon="i-lucide-trash-2"
                label="Delete"
                class="rounded-lg"
                @click="openDeleteModal(row.original)"
              />
            </div>
          </template>
        </UTable>

        <!-- Empty state -->
        <div
          v-if="!isLoading && tableData.length === 0"
          class="py-16 text-center"
        >
          <UIcon
            name="i-lucide-users"
            class="h-12 w-12 mx-auto text-gray-300 mb-3"
          />
          <p class="text-gray-500">Tidak ada data pegawai ditemukan.</p>
        </div>
      </div>

      <!-- Pagination Footer -->
      <div
        class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50"
      >
        <div class="flex items-center gap-3">
          <USelect
            v-model="perPage"
            :items="perPageOptions"
            size="sm"
            class="w-20 bg-white dark:bg-gray-900 rounded-lg"
          />
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan
            {{ (totalData || 0) === 0 ? 0 : (Number(currentPage || 1) - 1) * Number(perPage || 10) + 1 }}
            –
            {{ Math.min(Number(currentPage || 1) * Number(perPage || 10), (totalData || 0)) }}
            dari {{ totalData || 0 }} data
          </span>
        </div>

        <div class="flex gap-1">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-lucide-chevron-left"
            :disabled="currentPage <= 1 || isLoading"
            @click="currentPage--"
          />

          <UButton
            v-for="page in pageRange"
            :key="page"
            color="neutral"
            :variant="page === currentPage ? 'solid' : 'soft'"
            :label="String(page)"
            @click="currentPage = page"
          />

          <UButton
            color="neutral"
            variant="soft"
            icon="i-lucide-chevron-right"
            :disabled="currentPage >= totalPages || isLoading"
            @click="currentPage++"
          />
        </div>
      </div>
    </div>

    <!-- Komponen Modals -->
    <DashboardModalTambahPegawai v-model="isAddModalOpen" @success="handleSuccess" />
    <DashboardModalEditPegawai
      v-model="isEditModalOpen"
      :pegawai="selectedPegawai"
      @success="handleSuccess"
    />
    <DashboardModalHapusPegawai
      v-model="isDeleteModalOpen"
      :pegawai="selectedPegawai"
      @success="handleSuccess"
    />

    <!-- Sidebar Filter Unit Kerja -->
    <DashboardFilterUnitKerjaSidebar
      :open="isFilterOpen"
      :selected-id="selectedUnitId"
      @close="isFilterOpen = false"
      @select="handleSelectUnit"
    />

    <!-- Komponen Cetak (Terpisah) -->
    <DashboardPrintPegawaiTable
      :employees="employees"
      :search-query="search"
      :unit-id="selectedUnitId"
      :current-page="currentPage"
      :per-page="Number(perPage)"
    />
  </UContainer>
</template>

<style scoped></style>
