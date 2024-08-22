<template>
  <AntModal
    v-bind="omitProps"
    v-model:open="innerOpen"
    class="modal-pro"
    :class="`modal-pro--${styled}`"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template v-if="$slots.title" #title>
      <slot name="title"> </slot>
    </template>
    <template v-if="$slots.default" #default>
      <slot name="default"> </slot>
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer"> </slot>
    </template>
  </AntModal>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, watchEffect, useAttrs, onMounted } from 'vue';
  import { Modal as AntModal } from 'ant-design-vue';
  import type { ModalPro } from '.';
  import { omit } from '../../tools/tool';
  import useLoading from '../../hooks/loading';
  const attrs = useAttrs();
  const props = withDefaults(defineProps<ModalPro>(), {
    closable: true,
    destroyOnClose: true,
    styled: 'default',
    okText: '确认',
    cancelText: '取消',
    open: undefined,
    mask: true,
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
  const omitProps = computed(() =>
    omit(props, 'cancelButtonProps', 'onOk', 'onUpdate:open', 'onCancel'),
  );
  function handleOk() {
    loading.value = true;
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
