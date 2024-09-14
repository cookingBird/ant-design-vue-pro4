<template>
  <ConfigProvider :theme="theme">
    <Form ref="formRef" v-bind="props.formProps" :model="model">
      <Descriptions v-bind="omitProps" class="descriptions-pro">
        <template v-for="col of props.columns">
          <DescriptionsItem v-bind="itemPropsOmit(col)">
            <template #label>
              <div :class="isRequired(col.formItemProps) ? 'label--required' : ''">
                {{ col.label }}
              </div>
            </template>
            <FormItem v-bind="{ ...col.formItemProps, name: nameGetter(col) }">
              <TypeNode v-if="col.content" :options="{ ...col.content, name: nameGetter(col) }" :model="props.model" />
            </FormItem>
          </DescriptionsItem>
        </template>
      </Descriptions>
    </Form>
  </ConfigProvider>
</template>

<script setup lang="ts">
  import { computed, type PropType, ref } from 'vue';
  import { Descriptions, DescriptionsItem, Form, FormItem, ConfigProvider, message } from 'ant-design-vue';
  import { descriptionsProps, type DescriptionsItemProp } from 'ant-design-vue/es/descriptions/index';
  import { type FormProps, type FormItemProps } from 'ant-design-vue/es/form/index';
  import { type DescriptionsPropsPro } from './index.d';
  import { omit } from 'lodash';
  import TypeNode from '../TypeNode/index.vue';
  import useComponentTheme from '../../hooks/useComponentTheme';
  defineOptions({
    inheritAttrs: false,
  });
  const props = defineProps({
    ...descriptionsProps(),
    columns: Array as PropType<(DescriptionsItemProp & { content: any; formItemProps: FormItemProps })[]>,
    model: Object,
    tableLayout: {
      type: String,
      default: 'fixed',
    },
    formProps: { type: Object as PropType<FormProps> },
    class: String,
    style: String,
  });
  const omitProps = computed(() => omit(props, 'columns', 'model'));
  const itemPropsOmit = (item: DescriptionsPropsPro['columns'][number]) =>
    omit(item, 'content', 'formItemProps', 'label');

  const theme = useComponentTheme('Descriptions', {
    padding: '24px 24',
    paddingLG: '0px 24',
  });

  const formRef = ref<InstanceType<typeof Form> | null>(null);

  const isRequired = (formItem: FormItemProps | undefined) => formItem?.required || formItem?.rules;
  const nameGetter = (col: any) => col.formItemProps?.name || col.content?.name;

  defineExpose({
    validate: (...args) =>
      formRef.value
        // @ts-expect-error
        .validate(...args)
        .then(
          () =>
            (...args: Parameters<typeof message.success>) =>
              message.success(...args),
        )
        .catch((e) => {
          message.error(e.errorFields.map((f) => f.errors[0]).join(';'));
          return Promise.reject(e);
        }),
    // @ts-expect-error
    scrollToField: (...args) => formRef.value?.scrollToField(...args),
    // @ts-expect-error
    resetFields: (...args) => formRef.value?.resetFields(...args),
    // @ts-expect-error
    clearValidate: (...args) => formRef.value?.clearValidate(...args),
    validateFields: (...args) =>
      formRef.value
        // @ts-expect-error
        .validateFields(...args)
        .then(
          () =>
            (...args: Parameters<typeof message.success>) =>
              message.success(...args),
        )
        .catch((e) => {
          message.error(e.errorFields.map((f) => f.errors[0]).join(';'));
          return Promise.reject(e);
        }),
  });
</script>

<style>
  @import './index.css';
  .ant-descriptions.ant-descriptions-bordered .ant-descriptions-view > table {
    table-layout: v-bind(props.tableLayout);
  }
</style>
