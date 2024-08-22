<template>
  <Descriptions v-bind="omitProps">
    <template v-for="col of props.columns">
      <DescriptionsItem v-bind="itemPropsOmit(col)">
        <TypeNode v-if="col.content" :options="col.content" :model="props.model" />
      </DescriptionsItem>
    </template>
  </Descriptions>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { Descriptions, DescriptionsItem } from 'ant-design-vue';
  import { type DescriptionsPropsPro } from './index.d';
  import { omit } from '../../tools/tool';
  import TypeNode from '../TypeNode/index.vue';
  const props = defineProps<DescriptionsPropsPro>();
  const omitProps = computed(() => omit(props, 'columns', 'model'));
  const itemPropsOmit = (item: DescriptionsPropsPro['columns'][number]) =>
    omit(item, 'content');
</script>

<style scoped></style>
