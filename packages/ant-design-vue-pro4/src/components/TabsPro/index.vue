<template>
  <a-tabs
    v-bind="omitProps"
    class="tabs-pro"
    :data-height="props.height"
    :activeKey="internalActiveKey"
    @update:active-key="onUpdateActiveKey"
  >
    <template v-for="pane in panes" :key="pane.key ?? pane.tab">
      <a-tab-pane v-bind="omitComponent(pane)">
        <component v-bind="pane.componentProps" :is="pane.component"></component>
      </a-tab-pane>
    </template>
  </a-tabs>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import type { TabsPro } from '.';
  import useQueryStorage from '../../hooks/useQueryStorage';
  import { omit } from '../../tools/tool';
  const props = withDefaults(defineProps<TabsPro>(), {
    size: 'large',
    height: 'full',
    useRoute: true,
  });
  const omitProps = computed(() => omit(props, 'panes', 'onUpdate:activeKey'));
  const emit = defineEmits<{
    'update:activeKey': [val: string | number];
  }>();
  const { value: activeTabKeyValue } = useQueryStorage('activeTabKey', () => props.activeKey ?? props.panes[0]?.key);
  function onUpdateActiveKey(val: string | number) {
    emit('update:activeKey', val);
    if (props.useRoute) {
      activeTabKeyValue.value = val;
    }
  }

  const omitComponent = (ops) => omit(ops, 'component', 'componentProps');

  const internalActiveKey = useInternalActiveKey();
  function useInternalActiveKey() {
    const internalActiveKey = ref<string | undefined>(undefined);
    if (props.useRoute) {
      watch(
        () => activeTabKeyValue.value,
        (val) => {
          internalActiveKey.value = val?.toString();
        },
        { immediate: true },
      );
    } else {
      watch(
        () => props.activeKey,
        (val) => {
          if (val) {
            internalActiveKey.value = val.toString();
          }
        },
        { immediate: true },
      );
    }
    return internalActiveKey;
  }
</script>

<style>
  @import './index.scss';
</style>
