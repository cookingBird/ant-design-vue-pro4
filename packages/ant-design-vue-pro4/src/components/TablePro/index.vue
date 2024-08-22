<template>
  <div ref="tableRefWrapper" class="table-pro-wrapper" :data-style="styled">
    <ant-table
      v-if="!props.rawTable"
      ref="tableRef"
      v-bind="props"
      :class="autoFitHeight ? 'table-pro--autoHeight' : ''"
      :columns="withDefaultCols"
    >
      <template #bodyCell="{ column, record, index }">
        <slot
          v-if="column.slotIs"
          :name="column.dataIndex"
          :column="column"
          :index="index"
          :record="record"
          :row="record"
        >
          <type-node-vue
            v-if="column.dataIndex !== undefined && column.slotIs"
            :model="record"
            :options="{
              slotIs: column.slotIs,
              slotProps: column.slotProps,
              prop: column.prop,
              name: column.dataIndex,
              wrapperProps: column.wrapperProps,
            }"
          ></type-node-vue>
        </slot>
        <template v-else-if="column.dataIndex === 'index'">
          {{ index + 1 }}
        </template>
        <template v-else>
          {{ record[column.dataIndex] }}
        </template>
      </template>
    </ant-table>
    <ant-table
      v-else
      ref="tableRef"
      v-bind="props"
      :class="autoFitHeight ? 'table-pro--autoHeight' : ''"
      :columns="withDefaultCols"
    >
      <template #bodyCell="slotParams">
        <slot name="bodyCell" v-bind="slotParams"></slot>
      </template>
    </ant-table>
  </div>
</template>

<script lang="ts" setup>
  import { Table as AntTable } from 'ant-design-vue';
  import { computed, ref } from 'vue';
  import type { TablePro } from '.';
  import TypeNodeVue from '../TypeNode/index.vue';
  defineOptions({
    name: 'TablePro',
    inheritAttrs: true,
  });

  const props = withDefaults(defineProps<TablePro>(), {
    bordered: true,
    sticky: true,
    showHeader: true,
    autoFitHeight: true,
    styled: 'default',
    rawTable: false,
  });

  const tableRefWrapper = ref<HTMLDivElement | null>(null);

  const withDefaultCols = computed(
    () =>
      props.columns?.map((col) => ({
        ...col,
        align: col.align ?? 'center',
      })) || [],
  );

  const tableRef = ref<typeof AntTable | null>(null);

  defineExpose({
    tableRef,
  });
</script>

<style lang="css">
  @import './index.scss';
</style>
