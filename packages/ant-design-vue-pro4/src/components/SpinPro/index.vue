<template>
  <Spin v-bind="props">
    <slot></slot>
  </Spin>
</template>

<script setup lang="ts">
  import { Spin } from 'ant-design-vue';
  import { spinProps } from 'ant-design-vue/es/spin/Spin';
  defineOptions({
    inheritAttrs: true,
  });
  const props = defineProps({
    ...spinProps(),
  });
</script>

<style></style>
