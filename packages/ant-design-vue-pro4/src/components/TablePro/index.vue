<template>
  <ConfigProvider :theme="theme">
    <ant-table v-if="!props.rawTable" ref="tableRef" v-bind="props" :scroll="scroll" :columns="withDefaultCols">
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
      </template>
    </ant-table>
    <ant-table v-else ref="tableRef" v-bind="props" :scroll="scroll" :columns="withDefaultCols">
      <template #bodyCell="slotParams">
        <slot name="bodyCell" v-bind="slotParams"></slot>
      </template>
    </ant-table>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { treeMap } from '@easy/common-utils';
  import { computed, ref, type PropType } from 'vue';
  import { Table as AntTable, ConfigProvider } from 'ant-design-vue';
  import { tableProps } from 'ant-design-vue/es/table';
  import { type TableToken } from 'ant-design-vue/es/table/style';
  import TypeNodeVue from '../TypeNode/index.vue';
  import useTableScroll from '../../hooks/useTableScroll';
  import useComponentTheme from '../../hooks/useComponentTheme';
  defineOptions({
    name: 'TablePro',
    inheritAttrs: false,
  });

  const props = defineProps({
    ...tableProps(),
    bordered: {
      type: Boolean,
      default: true,
    },
    rawTable: {
      type: Boolean,
      default: false,
    },
    styled: {
      type: String,
      default: 'default',
    },
    theme: Object as PropType<TableToken>,
    class: String,
    style: String,
    pagination: {
      type: [Object, Boolean],
      default: false,
    },
  });

  const transparentTheme = computed<Partial<TableToken>>(() =>
    props.styled === 'transparent' ?
      {
        tableHeaderBg: 'transparent',
        tableBg: 'transparent',
      }
    : {},
  );
  const theme = useComponentTheme('Table', transparentTheme, props.theme);

  const withDefaultCols = computed(
    () =>
      // treeMap(props.columns, (col) => ({
      //   ...col,
      //   align: col.align ?? 'center',
      // })) || [],
      props.columns || [],
  );

  const tableRef = ref<InstanceType<typeof AntTable>>(null);
  const scroll = useTableScroll(tableRef);

  defineExpose({
    ...tableRef.value,
  });
</script>

<style lang="css">
  @import './index.css';
</style>
