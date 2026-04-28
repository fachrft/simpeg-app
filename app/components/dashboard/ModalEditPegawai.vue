<script setup lang="ts">
import { reactive, ref, onMounted, watch } from "vue";
import { AGAMA_OPTIONS } from "~/constants/options";

const props = defineProps({
  pegawai: {
    type: Object as PropType<any | null>,
    default: null,
  },
});

const isOpen = defineModel<boolean>({ default: false });
const { getGolongan, getUnitKerja } = useReferenceData();
const toast = useToast();

const golongans = ref<any[]>([]);
const unitKerjas = ref<any[]>([]);
const isLoading = ref(false);
const previewUrl = ref<string | null>(null);

const employeeData = reactive({
  nip: "",
  nama: "",
  tempat_lahir: "",
  alamat: "",
  tanggal_lahir: "",
  jenis_kelamin: "",
  golongan_id: "",
  eselon: "",
  jabatan: "",
  tempat_tugas: "",
  agama: "",
  unit_kerja_id: "",
  no_hp: "",
  npwp: "",
  foto: null as File | string | null,
});

const emit = defineEmits(["success"]);

// Watcher untuk isi data saat modal dibuka
watch(
  () => isOpen.value,
  (newVal) => {
    if (newVal && props.pegawai) {
      // Edit Mode: Populate data
      Object.keys(employeeData).forEach((key) => {
        if (key !== "foto" && props.pegawai[key] !== undefined) {
          (employeeData as any)[key] = props.pegawai[key] || "";
        }
      });
      
      // Tampilkan foto existing jika ada (misal dari backend)
      if (props.pegawai.foto) {
        const config = useRuntimeConfig();
        previewUrl.value = `${config.public.apiBase.replace('/api', '')}/storage/${props.pegawai.foto}`;
      } else {
        previewUrl.value = null;
      }
    }
  }
);


const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    employeeData.foto = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const handleSave = async () => {
  if (!props.pegawai) return;

  const saveToast = toast.add({
    id: "edit_pegawai",
    title: "Mohon tunggu",
    description: "Sedang memperbarui data pegawai...",
    icon: "i-lucide-loader-circle",
    duration: 0,
    close: false,
    ui: {
      icon: "animate-spin",
    },
  });

  isLoading.value = true;
  try {
    const formData = new FormData();
    
    Object.keys(employeeData).forEach((key) => {
      const val = employeeData[key as keyof typeof employeeData];
      if (val !== null && val !== "") {
        // Jangan kirim foto jika tidak ada file baru yang diupload saat edit
        if (key === 'foto' && typeof val === 'string') return;
        formData.append(key, val as string | Blob);
      }
    });

    const endpoint = `/pegawai/${props.pegawai.id}`;
    // Laravel butuh _method=PUT karena kita kirim FormData (multipart/form-data)
    formData.append('_method', 'PUT');

    await useApi(endpoint, {
      method: "POST", // Tetap POST karena kirim FormData, method PUT disimulasikan via _method
      body: formData,
    });

    toast.update("edit_pegawai", {
      title: "Berhasil",
      description: "Data pegawai berhasil diperbarui",
      color: "success",
      icon: "i-lucide-check",
      duration: 2000,
      ui: { icon: "" },
    });

    emit("success");
    isOpen.value = false;
  } catch (error: any) {
    toast.update("edit_pegawai", {
      title: "Gagal",
      description: error.data?.message || "Terjadi kesalahan saat memperbarui data",
      color: "error",
      icon: "i-lucide-circle-alert",
      duration: 3000,
      ui: { icon: "" },
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  const [dataGol, dataUnit] = await Promise.all([
    getGolongan(),
    getUnitKerja()
  ]);
  golongans.value = dataGol;
  unitKerjas.value = dataUnit.dropdown;
});
</script>

<template>
  <UModal v-model:open="isOpen" prevent-close :ui="{ content: 'sm:max-w-4xl' }">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Edit Data Pegawai
            </h3>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <div class="max-h-[65vh] overflow-y-auto px-2 py-1 no-scrollbar">
          <UForm :state="employeeData" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <!-- Kolom Kiri: Foto Profil -->
              <div class="col-span-1">
                <UFormField label="Foto Profil" name="foto">
                  <div class="mt-2 flex justify-center">
                    <div
                      class="relative w-40 h-40 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer group overflow-hidden bg-gray-50/50 dark:bg-gray-800/30"
                    >
                      <img v-if="previewUrl" :src="previewUrl" class="absolute inset-0 w-full h-full object-cover" />
                      
                      <div v-else class="text-center p-4">
                        <UIcon name="i-lucide-camera" class="mx-auto h-10 w-10 text-gray-400 group-hover:text-primary transition-colors" />
                        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">Pilih Foto</div>
                      </div>

                      <div v-if="previewUrl" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <UIcon name="i-lucide-pencil" class="text-white h-6 w-6" />
                      </div>
                      
                      <input id="foto-upload-edit" name="foto-upload-edit" type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" @change="onFileChange" />
                    </div>
                  </div>
                  <p class="text-[10px] text-center text-gray-500 mt-2">PNG, JPG (Max 2MB)</p>
                </UFormField>
              </div>

              <!-- Kolom Kanan: Form Fields -->
              <div class="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UFormField label="NIP" name="nip">
                  <UInput v-model="employeeData.nip" placeholder="Masukkan NIP" class="w-full" />
                </UFormField>
                <UFormField label="Nama Lengkap" name="nama">
                  <UInput v-model="employeeData.nama" placeholder="Masukkan Nama Lengkap" class="w-full" />
                </UFormField>
                <UFormField label="Tempat Lahir" name="tempat_lahir">
                  <UInput v-model="employeeData.tempat_lahir" placeholder="Tempat Lahir" class="w-full" />
                </UFormField>
                <UFormField label="Tanggal Lahir" name="tanggal_lahir">
                  <UInput v-model="employeeData.tanggal_lahir" type="date" class="w-full" />
                </UFormField>
                <UFormField label="Jenis Kelamin" name="jenis_kelamin">
                  <div class="flex items-center gap-6 pt-1.5">
                    <label class="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-200">
                      <input type="radio" v-model="employeeData.jenis_kelamin" value="L" class="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-900 dark:bg-gray-800 dark:border-gray-700" />
                      Laki-laki
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-200">
                      <input type="radio" v-model="employeeData.jenis_kelamin" value="P" class="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-900 dark:bg-gray-800 dark:border-gray-700" />
                      Perempuan
                    </label>
                  </div>
                </UFormField>
                <UFormField label="Agama" name="agama">
                  <USelect v-model="employeeData.agama" :items="AGAMA_OPTIONS" placeholder="Pilih Agama" class="w-full" />
                </UFormField>
                <UFormField label="Golongan" name="golongan_id">
                  <USelect v-model="employeeData.golongan_id" :items="golongans" placeholder="Pilih Golongan" class="w-full" />
                </UFormField>
                <UFormField label="Eselon" name="eselon">
                  <UInput v-model="employeeData.eselon" placeholder="Misal: III" class="w-full" />
                </UFormField>
                <UFormField label="Jabatan" name="jabatan">
                  <UInput v-model="employeeData.jabatan" placeholder="Jabatan saat ini" class="w-full" />
                </UFormField>
                <UFormField label="Tempat Tugas" name="tempat_tugas">
                  <UInput v-model="employeeData.tempat_tugas" placeholder="Tempat tugas" class="w-full" />
                </UFormField>
                <UFormField label="Unit Kerja" name="unit_kerja_id">
                  <USelect v-model="employeeData.unit_kerja_id" :items="unitKerjas" placeholder="Pilih Unit Kerja" class="w-full" />
                </UFormField>
                <UFormField label="No. HP" name="no_hp">
                  <UInput v-model="employeeData.no_hp" placeholder="Nomor Handphone" class="w-full" />
                </UFormField>
                <UFormField label="NPWP" name="npwp">
                  <UInput v-model="employeeData.npwp" placeholder="Nomor NPWP" class="w-full" />
                </UFormField>
                <UFormField label="Alamat" name="alamat" class="sm:col-span-2 w-full">
                  <UTextarea v-model="employeeData.alamat" placeholder="Alamat lengkap" :rows="3" class="w-full" />
                </UFormField>
              </div>
            </div>
          </UForm>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="ghost" label="Batal" @click="isOpen = false" />
            <UButton color="primary" label="Simpan Perubahan" :loading="isLoading" @click="handleSave" />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
