import type { VisibleOps } from '../../types';

import type { TypeNodeProp } from '../TypeNode/index';

import type { ColProps, FormItemProps, FormProps, RowProps } from 'ant-design-vue';

import type { ValueInterceptor } from '../../hooks/value';

export type FormItemProOptions = Partial<VisibleOps> &
  Partial<ValueInterceptor> &
  TypeNodeProp & {
    formItemProps: FormItemProps;
    col?: ColProps;
    children?: {
      columns: FormItemProOptions[];
      row?: RowProps;
      colon?: FormItemProps['colon'];
      labelCol?: FormItemProps['labelCol'];
      labelAlign?: FormItemProps['labelAlign'];
    };
  };

export type FormProProps = FormProps & {
  options: {
    columns: FormItemProOptions[];
    row?: RowProps;
  } & FormProps;
  styled?: 'transparent' | 'default';
};
