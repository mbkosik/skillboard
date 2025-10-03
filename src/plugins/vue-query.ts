import { VueQueryPlugin, QueryClient, VueQueryPluginOptions } from '@tanstack/vue-query'

const queryClient = new QueryClient()

export const vueQueryPlugin: VueQueryPluginOptions = {
  queryClient,
}

export { VueQueryPlugin }
