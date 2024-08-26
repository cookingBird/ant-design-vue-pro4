import { type DescriptionsItemProp } from 'ant-design-vue/es/descriptions';
// import type { DescriptionsProps } from 'ant-design-vue';
import type { TypeNodeProp } from '../TypeNode/index.d';

export type DescriptionsItemPropPro = {} & {
  content: TypeNodeProp;
};
// export type DescriptionsItemPropPro = DescriptionsItemProp & {
//   content: TypeNodeProp;
// };
// export type DescriptionsPropsPro = DescriptionsProps & {
//   columns: DescriptionsItemPropPro[];
//   model: Record<string, any>;
// };
export type DescriptionsPropsPro = {} & {
  columns: DescriptionsItemPropPro[];
  model: Record<string, any>;
  tableLayout?: 'fixed' | 'auto';
};
