import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBrowserLocation } from '@vueuse/core';
import { queryParse } from '@easy/common-utils'

export default function useQueryStorage<T>(key: string, fallbackValue: () => T) {
  const location = useBrowserLocation();
  const router = useRouter();
  const locationQuery = computed(() => {
    const { search, hash } = location.value
    return {
      ...queryParse(search.split('?')[1] || ''),
      ...queryParse(hash.split('?')[1] || '')
    }
  })
  const value = computed<T>({
    get() {
      return (router.currentRoute.value.query[key] ?? locationQuery.value[key] ?? fallbackValue()) as unknown as T;
    },
    set(val) {
      const { pathname, hash } = location.value
      const path = router.currentRoute.value.path || pathname + hash
      router.push({
        ...router.currentRoute.value,
        path,
        query: {
          ...router.currentRoute.value.query || locationQuery.value,
          [key]: val as any,
        },
      });
    },
  });
  return {
    getItem(key: string) {
      return router.currentRoute.value.query[key];
    },
    setItem(key: string, val: any) {
      router.push({
        ...router.currentRoute.value,
        query: {
          ...router.currentRoute.value.query,
          [key]: val,
        },
      });
    },
    query: computed(() => router.currentRoute.value.query),
    value,
  };
}
