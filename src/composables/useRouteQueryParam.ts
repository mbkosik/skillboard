import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { WritableComputedRef } from 'vue'

export function useRouteQueryParam<T extends string>(
  key: string,
  options: { default: T; allowed?: readonly T[] }
): WritableComputedRef<T> {
  const route = useRoute()
  const router = useRouter()

  return computed<T>({
    get() {
      const raw = route.query[key]
      const first = Array.isArray(raw) ? raw[0] : (raw as string | undefined)
      if (typeof first === 'string') {
        if (!options.allowed || options.allowed.includes(first as T)) {
          return first as T
        }
      }
      return options.default
    },
    set(v: T) {
      const newQuery = { ...(route.query || {}) } as Record<string, string | string[] | undefined>
      if (v === '') {
        delete newQuery[key]
      } else {
        newQuery[key] = v
      }
      router.replace({ query: newQuery })
    },
  })
}
