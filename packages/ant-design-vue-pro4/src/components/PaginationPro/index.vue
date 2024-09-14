<template>
  <div class="pagination-pro-wrapper">
    <AntPagination v-bind="props" :current="innerCurrent" @update:current="handleCurrent">
      <slot></slot>
    </AntPagination>
  </div>
</template>

<script setup lang="ts">
  import { computed, type PropType } from 'vue';
  import { Pagination as AntPagination } from 'ant-design-vue';
  import { paginationProps, type PaginationProps } from 'ant-design-vue/es/pagination';

  defineOptions({
    name: 'PaginationPro',
    inheritAttrs: true,
  });

  const emit = defineEmits(['update:pageNo']);

  const props = defineProps({
    ...paginationProps(),
    showSizeChanger: {
      type: Boolean,
      default: true,
    },
    pageSizeOptions: {
      type: Array as PropType<string[]>,
      default: () => ['10', '20', '30', '50', '70', '100'],
    },
    showTotal: {
      type: Function as PropType<(total: number, range: [number, number]) => any>,
      default: () => (total: number) => `共 ${total} 条`,
    },
    pageNo: Number,
  });
  const innerCurrent = computed(() => props.current || props.pageNo);
  const handleCurrent = (val: number) => {
    emit('update:pageNo', val);
  };
</script>

<style>
  @import './index.scss';
</style>
