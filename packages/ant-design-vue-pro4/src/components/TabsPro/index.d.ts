import type { TabPaneProps, TabsProps } from 'ant-design-vue';

export type TabPanePro = TabPaneProps & {
  component: any;
  key?: string;
  tab: string;
  componentProps?: {};
};
export type TabsPro = TabsProps & {
  panes: TabPanePro[];
  height?: 'full' | 'auto';
  useRoute?: boolean;
};
