<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  pegawai: {
    type: Object as PropType<any | null>,
    default: null,
  },
});

const isOpen = defineModel<boolean>({ default: false });
const emit = defineEmits(["success"]);

const toast = useToast();
const isDeleting = ref(false);

const handleDelete = async () => {
  if (!props.pegawai) return;
  
  isDeleting.value = true;
  try {
    await useApi(`/pegawai/${props.pegawai.id}`, {
      method: "DELETE",
    });
    
    toast.add({
      title: "Berhasil",
      description: "Data pegawai berhasil dihapus",
      color: "success",
      icon: "i-lucide-check",
    });
    
    emit("success");
    isOpen.value = false;
  } catch (error: any) {
    toast.add({
      title: "Gagal",
      description: error.data?.message || "Terjadi kesalahan saat menghapus data",
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Konfirmasi Hapus
            </h3>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <div class="py-4">
          <div class="flex items-center gap-4">
            <div class="bg-red-100 dark:bg-red-900/30 p-3 rounded-full shrink-0">
              <UIcon name="i-lucide-triangle-alert" class="w-6 h-6 text-red-600 dark:text-red-500" />
            </div>
            <div>
              <p class="text-gray-700 dark:text-gray-300">
                Apakah Anda yakin ingin menghapus data pegawai 
                <span class="font-semibold">{{ pegawai?.nama }}</span>?
              </p>
              <p class="text-sm text-gray-500 mt-1">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="ghost" label="Batal" @click="isOpen = false" />
            <UButton color="error" label="Hapus" :loading="isDeleting" @click="handleDelete" />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
