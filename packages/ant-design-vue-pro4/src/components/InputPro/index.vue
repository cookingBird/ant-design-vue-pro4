<template>
  <AntInput
    ref="input"
    v-bind="omitProps"
    :value="outerValue"
    :disabled="innerDisabled"
    @update:value="updateValueHandler"
  >
    <template v-if="$slots.addonAfter" #addonAfter>
      <slot name="addonAfter"> </slot>
    </template>
    <template v-if="$slots.addonBefore" #addonBefore>
      <slot name="addonBefore"> </slot>
    </template>
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix"> </slot>
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix"> </slot>
    </template>
  </AntInput>
</template>

<script setup lang="ts">
  import { Input as AntInput } from 'ant-design-vue';
  import inputProps from 'ant-design-vue/es/input/inputProps';
  import { computed, onMounted, ref } from 'vue';
  import { useValue } from '../../hooks/value';
  import { omit } from '../../tools/tool';
  defineOptions({
    name: 'InputPro',
  });
  const props = defineProps({
    ...inputProps(),
    autocomplete: {
      type: String,
      default: 'off',
    },
    placeholder: {
      type: String,
      default: '请输入',
    },
    // --------------- data bind----------------
    model: Object,
    prop: [String, Array],
    beforeValue: Function,
    afterChange: Function,
    // -----------------------------
    readonly: Boolean,
    addonBeforeClick: Function,
    addonAfterClick: Function,
  });
  const beforeValue = props.beforeValue || ((v) => v);
  const afterChange = props.afterChange || ((v) => v);
  const omitProps = computed(() => omit(props, 'onUpdate:value', 'beforeValue', 'afterChange', 'model', 'prop'));
  const innerDisabled = computed(() => props.disabled ?? props.readonly);
  const { valueGetter, valueSetter } = useValue(props.prop);
  const outerValue = computed(() => beforeValue(props.value || (props.model && valueGetter(props.model))) as string);

  const emit = defineEmits<{
    'update:value': [val: any];
  }>();
  const updateValueHandler = (val: any) => {
    const _n = afterChange(val);
    emit('update:value', _n);
    props.model && valueSetter(props.model, _n);
  };
  const input = ref<InstanceType<typeof AntInput>>();
  onMounted(() => {
    const rootEl: HTMLElement | undefined = input.value?.$el;

    const addon = Array.from(rootEl?.querySelectorAll('.ant-input-group-addon') ?? []);
    const before = addon[0];
    if (props.addonBefore && props.addonBeforeClick && before) {
      before.addEventListener('click', () => {
        props.addonBeforeClick?.();
      });
      before.setAttribute('style', 'cursor:pointer');
    }
    const after = addon[1];
    if (props.addonBefore && props.addonAfterClick && after) {
      after.addEventListener('click', () => {
        props.addonAfterClick?.();
      });
      after.setAttribute('style', 'cursor:pointer');
    }
  });
</script>

<style>
  @import './index.scss';
</style>
