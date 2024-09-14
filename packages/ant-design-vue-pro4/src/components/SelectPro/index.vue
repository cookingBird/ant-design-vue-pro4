<template>
  <AntSelect
    ref="selectRef"
    class="select-pro"
    v-bind="omitProps"
    :value="innerValue"
    :loading="innerLoading"
    :options="builtOptions"
    :showSearch="innerShowSearch"
    @update:value="updateValueHandler"
    @search="hanldeChange"
  >
  </AntSelect>
</template>

<script lang="ts" setup>
  import { Select as AntSelect } from 'ant-design-vue';
  import { computed, ref, watchEffect, onMounted } from 'vue';
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

  const omitProps = computed(() =>
    omit(props, 'model', 'fetch', 'open', 'onUpdate:value', 'beforeValue', 'afterChange', 'showSearch'),
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
    const res = props.beforeValue!(props.value ?? valueGetter(props.model)) as string | number;
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
  //------------------------- insertable
  const inputVal = ref('');
  function hanldeChange(val: string) {
    inputVal.value = val;
    console.log('hanldeChange val', val);
  }
  const selectRef = ref(null);
  onMounted(handleInsertable);
  function handleInsertable() {
    if (!props.insertable) return;
    const root = selectRef.value.$el as HTMLElement;
    const inputElement = root.querySelector('input');
    if (!inputElement) return;
    inputElement.addEventListener('keydown', function (event) {
      const val = inputVal.value;
      if (!val) return;
      if (event.key === 'Enter') {
        // 或者使用 event.keyCode === 13
        // 这里添加你的处理逻辑
        const existOps =
          (typeof props.filterOption === 'function' &&
            builtOptions.value
              // @ts-expect-error
              .map((item) => props.filterOption(val, item))
              .some((t) => t === true)) ||
          (typeof props.filterOption === 'boolean' &&
            builtOptions.value
              .map((item) => item.label.toLowerCase().indexOf(val.toLowerCase()) >= 0)
              .some((t) => t === true));
        if (!existOps) {
          // 不存在选项
          builtOptions.value.push({
            label: val,
            value: val,
          });
          updateValueHandler(val);
        }
      }
    });
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
