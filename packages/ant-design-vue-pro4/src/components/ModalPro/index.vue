<template>
  <ConfigProvider
    v-if="$attrs._close"
    :locale="zhCN"
  >
    <AntModal
      v-bind="omitProps"
      v-model:open="innerOpen"
      class="modal-pro"
      :class="`modal-pro--${styled}`"
      :confirmLoading="loading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template
        v-if="$slots.title"
        #title
      >
        <slot name="title"> </slot>
      </template>
      <template
        v-if="$slots.default"
        #default
      >
        <slot name="default"> </slot>
      </template>
      <template
        v-if="$slots.footer"
        #footer
      >
        <slot name="footer"> </slot>
      </template>
    </AntModal>
  </ConfigProvider>
  <AntModal
    v-else
    v-bind="omitProps"
    v-model:open="innerOpen"
    class="modal-pro"
    :class="`modal-pro--${styled}`"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template
      v-if="$slots.title"
      #title
    >
      <slot name="title"> </slot>
    </template>
    <template
      v-if="$slots.default"
      #default
    >
      <slot name="default"> </slot>
    </template>
    <template
      v-if="$slots.footer"
      #footer
    >
      <slot name="footer"> </slot>
    </template>
  </AntModal>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, watchEffect, useAttrs, type PropType } from 'vue';
  import { Modal as AntModal, ConfigProvider } from 'ant-design-vue';
  import zhCN from 'ant-design-vue/locale/zh_CN';
  import { modalProps } from 'ant-design-vue/es/modal/Modal';
  import { omit } from '../../tools/tool';
  import useLoading from '../../hooks/loading';
  const attrs = useAttrs();
  const props = defineProps({
    ...modalProps(),
    styled: {
      type: String,
      default: 'default',
    },
    mask: {
      type: Boolean,
      default: true,
    },
    destroyOnClose: {
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits<{
    'ok': [done: () => void];
    'update:open': [v: boolean];
    'cancel': [];
  }>();
  const innerVisible = ref(true);
  const innerOpen = computed({
    get() {
      return props.open ?? innerVisible.value;
    },
    set(val) {
      innerVisible.value = val;
      emit('update:open', val);
    },
  });
  const { loading, done } = useLoading();
  const omitProps = computed(() => omit(props, 'cancelButtonProps', 'onOk', 'onUpdate:open', 'onCancel'));
  function handleOk() {
    loading.value = true;
    // @ts-expect-error
    props.onOk?.(done);
    // @ts-expect-error
    attrs._ok?.();
    // @ts-expect-error
    attrs._onConfirm?.();
  }
  function handleCancel() {
    // @ts-expect-error
    attrs._cancel?.();
    // @ts-expect-error
    attrs._close?.();
    emit('cancel');
  }
  defineExpose({
    close() {
      innerVisible.value = false;
      // @ts-expect-error
      attrs._cancel?.();
      // @ts-expect-error
      attrs._close?.();
    },
  });
</script>

<style lang="scss">
  @import './index.scss';
</style>
