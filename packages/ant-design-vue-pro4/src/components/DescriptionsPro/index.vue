<template>
  <ConfigProvider :theme="theme">
    <Form ref="formRef" v-bind="props.formProps" :model="model">
      <Descriptions v-bind="omitProps" class="descriptions-pro">
        <template v-for="col of props.columns">
          <DescriptionsItem v-bind="itemPropsOmit(col)">
            <FormItem v-bind="col.formItemProps">
              <TypeNode v-if="col.content" :options="col.content" :model="props.model" />
            </FormItem>
          </DescriptionsItem>
        </template>
      </Descriptions>
    </Form>
  </ConfigProvider>
</template>

<script setup lang="ts">
  import { computed, type PropType } from 'vue';
  import { Descriptions, DescriptionsItem, Form, FormItem, ConfigProvider } from 'ant-design-vue';
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
    columns: Array as PropType<DescriptionsItemProp & { content: any; formItemProps: FormItemProps }[]>,
    model: Object,
    tableLayout: {
      type: String,
      default: 'fixed',
    },
    formProps: Object as PropType<FormProps>,
    class: String,
    style: String,
  });
  const omitProps = computed(() => omit(props, 'columns', 'model'));
  const itemPropsOmit = (item: DescriptionsPropsPro['columns'][number]) => omit(item, 'content', 'formItemProps');

  const theme = useComponentTheme('Descriptions', {
    padding: '24px 24',
    paddingLG: '0px 24',
  });

  const formRef = ref<InstanceType<typeof Form>>();

  defineExpose({
    validate: (...args) => formRef.value?.validate(...args),
    scrollToField: (...args) => formRef.value?.scrollToField(...args),
    resetFields: (...args) => formRef.value?.resetFields(...args),
    clearValidate: (...args) => formRef.value?.clearValidate(...args),
    validateFields: (...args) => formRef.value?.validateFields(...args),
  });
</script>

<style>
  .ant-descriptions.ant-descriptions-bordered .ant-descriptions-view > table {
    table-layout: v-bind(props.tableLayout);
  }
  .descriptions-pro.ant-descriptions th.ant-descriptions-item-label {
    padding-top: 0px;
  }
</style>
