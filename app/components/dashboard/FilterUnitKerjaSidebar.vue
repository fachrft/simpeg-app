<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  selectedId: number | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "select", id: number | null): void;
}>();

const { getUnitKerja } = useReferenceData();
const tree = ref<any[]>([]);
const expanded = ref<Set<number>>(new Set());
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  const { tree: unitTree } = await getUnitKerja();
  tree.value = unitTree;
  // Auto-expand root nodes
  tree.value.forEach(node => expanded.value.add(node.id));
  isLoading.value = false;
});

const toggle = (id: number) => {
  if (expanded.value.has(id)) {
    expanded.value.delete(id);
  } else {
    expanded.value.add(id);
  }
};

const selectUnit = (id: number | null) => {
  emit("select", id);
  emit("close");
};
</script>

<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/30 z-40"
      @click="emit('close')"
    />
  </Transition>

  <!-- Sidebar Panel -->
  <Transition name="slide">
    <div
      v-if="open"
      class="fixed top-0 right-0 h-full w-80 z-50 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-filter" class="w-4 h-4 text-primary" />
          <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Filter Unit Kerja</h3>
        </div>
        <UButton color="neutral" variant="ghost" icon="i-lucide-x" size="xs" @click="emit('close')" />
      </div>

      <!-- Reset -->
      <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <button
          class="w-full text-left text-sm px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
          :class="selectedId === null
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
          @click="selectUnit(null)"
        >
          <UIcon name="i-lucide-layers" class="w-4 h-4 shrink-0" />
          Semua Unit Kerja
        </button>
      </div>

      <!-- Tree -->
      <div class="flex-1 overflow-y-auto p-3">
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <UIcon name="i-lucide-loader-circle" class="animate-spin w-5 h-5 text-gray-400" />
        </div>

        <template v-else>
          <DashboardFilterUnitKerjaNode
            v-for="node in tree"
            :key="node.id"
            :node="node"
            :selected-id="selectedId"
            :expanded="expanded"
            @select="selectUnit"
            @toggle="toggle"
          />
        </template>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
