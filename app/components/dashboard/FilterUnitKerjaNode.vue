<script setup lang="ts">
const props = defineProps<{
  node: { id: number; label: string; children: any[] };
  selectedId: number | null;
  expanded: Set<number>;
}>();

const emit = defineEmits<{
  (e: "select", id: number): void;
  (e: "toggle", id: number): void;
}>();

const hasChildren = computed(() => props.node.children && props.node.children.length > 0);
const isExpanded = computed(() => props.expanded.has(props.node.id));
const isSelected = computed(() => props.selectedId === props.node.id);
</script>

<template>
  <div>
    <!-- Node Row -->
    <div
      class="flex items-center gap-1 rounded-lg transition-colors group cursor-pointer my-0.5"
      :class="isSelected
        ? 'bg-primary/10 text-primary'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
    >
      <!-- Expand / Collapse toggle -->
      <button
        class="shrink-0 w-6 h-6 flex items-center justify-center rounded"
        @click.stop="hasChildren ? emit('toggle', node.id) : undefined"
      >
        <UIcon
          v-if="hasChildren"
          :name="isExpanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          class="w-3.5 h-3.5 text-gray-400"
        />
        <span v-else class="w-3.5 h-3.5 flex items-center justify-center">
          <span class="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
        </span>
      </button>

      <!-- Label -->
      <button
        class="flex-1 text-left text-sm py-1.5 pr-2 font-medium truncate"
        :class="isSelected ? 'text-primary' : ''"
        @click="emit('select', node.id)"
      >
        {{ node.label }}
      </button>

      <!-- Jumlah children badge -->
      <span
        v-if="hasChildren"
        class="text-[10px] mr-2 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 shrink-0"
      >
        {{ node.children.length }}
      </span>
    </div>

    <!-- Children (Recursive) -->
    <Transition name="tree-expand">
      <div v-if="hasChildren && isExpanded" class="pl-4 border-l border-gray-200 dark:border-gray-700 ml-3">
        <DashboardFilterUnitKerjaNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :selected-id="selectedId"
          :expanded="expanded"
          @select="emit('select', $event)"
          @toggle="emit('toggle', $event)"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tree-expand-enter-active,
.tree-expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.tree-expand-enter-from,
.tree-expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.tree-expand-enter-to,
.tree-expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}
</style>
