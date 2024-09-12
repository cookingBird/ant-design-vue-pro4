import { type Ref, ref, computed, nextTick } from 'vue';
import { Table } from 'ant-design-vue';
import { useResizeObserver } from '@vueuse/core';
import { debounce } from 'lodash';

const getMarginValue = (element: HTMLElement | null) => {
  if (!element) return null;
  const style = window.getComputedStyle(element);

  const marginTop = parseFloat(style.marginTop);
  const marginLeft = parseFloat(style.marginLeft);
  const marginBottom = parseFloat(style.marginBottom);
  const marginRight = parseFloat(style.marginRight);

  return {
    top: marginTop,
    left: marginLeft,
    right: marginRight,
    bottom: marginBottom
  };
}


let seed = 0;
export default function useTableScroll(tableRef: Ref<InstanceType<typeof Table>>) {
  seed++;
  // 计算ant table scroll高度
  const calctableScroll = debounce(
    function calctableScroll(antTableContainer: HTMLElement, scroll: Ref<{ y: number | string | undefined }>) {
      const antHeader = (antTableContainer.querySelector(
        '.ant-table-header',
      ) || antTableContainer.querySelector(
        '.ant-table-content table thead',
      )) as HTMLElement;
      const antPagination = antTableContainer.querySelector(
        '.ant-pagination.ant-table-pagination',
      ) as HTMLElement;
      let margin = getMarginValue(null);
      if (antHeader && antTableContainer.offsetHeight && antHeader.offsetHeight) {
        scroll.value.y = antTableContainer.offsetHeight - antHeader.offsetHeight - ((margin = getMarginValue(antPagination)) ? (margin.top + margin.bottom + antPagination.offsetHeight) : 0);
      }
    },
    100,
    { leading: false },
  );
  const scroll = ref({
    y: undefined,
  });
  const antTable = computed(() => tableRef.value?.$el?.querySelector('.ant-table'));

  useResizeObserver(
    antTable,
    () => {
      nextTick(() => {
        calctableScroll(tableRef.value!.$el as HTMLElement, scroll);
      });
    },
  );

  return scroll;
}
