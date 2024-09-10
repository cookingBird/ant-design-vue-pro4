import type { Ref } from 'vue';
import { computed, unref } from 'vue';
import { merge } from 'lodash';
import type { ComponentTokenMap } from 'ant-design-vue/es/theme/interface/components';
export default function useComponentTheme<T extends keyof ComponentTokenMap, M = ComponentTokenMap[T]>(name: T, defaultTheme: M | Ref<M>, ...restTheme: (M | Ref<M>)[]) {
  return computed(() => ({
    components: {
      [name]: merge(unref(defaultTheme), ...(restTheme.map(t => unref(t))))
    }
  }))
}
