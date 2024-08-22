<template>
  <AntSelect
    class="select-pro"
    v-bind="omitProps"
    :value="innerValue"
    :loading="innerLoading"
    :options="builtOptions"
    :showSearch="innerShowSearch"
    @update:value="updateValueHandler"
    @search="handleSearch"
  >
  </AntSelect>
</template>

<script lang="ts" setup>
  import { Select as AntSelect } from 'ant-design-vue';
  import { computed, ref, watchEffect } from 'vue';
  import type { SelectOption, SelectPro } from '.';
  import { useFetch } from '../../hooks/fetch';
  import { useValue } from '../../hooks/value';
  import { callFunction, omit } from '../../tools/tool';

  const props = withDefaults(defineProps<SelectPro>(), {
    beforeValue: (v: any) => v,
    afterChange: (v: any) => v,
    bordered: true,
    showArrow: true,
    placeholder: '请选择',
    mode: undefined,
    allowClear: true,
    maxTagCount: 'responsive',
    maxTagTextLength: 48,
    showSearch: false,
    filterOption: () => (input: string, option: any) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    fieldNames: () => ({ label: 'label', value: 'value', options: 'options' }),
  });

  const innerShowSearch = ref(props.showSearch || props.insertable);

  console.log('select pro', props);
  const omitProps = computed(() =>
    omit(
      props,
      'model',
      'fetch',
      'open',
      'onUpdate:value',
      'beforeValue',
      'afterChange',
      'showSearch',
    ),
  );
  // fetch data
  const fetchOps = ref<SelectOption[]>([]);
  const builtOptions = ref([]);
  watchEffect(() => {
    const outerOps = callFunction(props.options, props.model);
    if (outerOps) {
      builtOptions.value = outerOps;
    } else {
      builtOptions.value = fetchOps.value;
    }
  });
  const innerLoading = ref(false);
  if (props.fetch) {
    const { result, loading } = useFetch(
      props.fetch,
      computed(() => props.model),
      props.effectKeys,
    );
    watchEffect(() => {
      // console.log('select fetch', result.value);
      fetchOps.value = result.value;
      innerLoading.value = loading.value;
    });
  }
  // bind model
  const { valueGetter, valueSetter } = useValue(props.prop);
  const innerValue = computed(() => {
    const res = props.beforeValue!(props.value ?? valueGetter(props.model)) as
      | string
      | number;
    return res === '' ? undefined : res;
  });
  const emit = defineEmits<{
    'update:value': [val: any];
  }>();
  const updateValueHandler = (val: any) => {
    const _n = props.afterChange!(val);
    emit('update:value', _n);
    props.model && valueSetter(props.model, _n);
  };
  const handleSearch = (val: string) => {
    if (!props.insertable) return;
    const existOps =
      (typeof props.filterOption === 'function' &&
        builtOptions.value
          // @ts-expect-error
          .map((item) => props.filterOption(val, item))
          .some((t) => t === true)) ||
      (typeof props.filterOption === 'boolean' &&
        builtOptions.value
          .map(
            (item) =>
              // @ts-expect-error
              item[props.fieldNames.label].toLowerCase().indexOf(val.toLowerCase()) >= 0,
          )
          .some((t) => t === true));
    if (!existOps) {
      // 不存在选项
      builtOptions.value.push({
        label: val,
        value: val,
      });
    }
  };
</script>

<style lang="scss">
  @import './index.scss';
</style>
