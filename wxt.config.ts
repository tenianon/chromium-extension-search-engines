import { defineConfig } from 'wxt'
import tailwindcss from '@tailwindcss/vite'

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  imports: false,
  manifest: {
    permissions: ['tabs', 'webNavigation', 'scripting'],
    host_permissions: ['https://*.bing.com/*', 'https://*.google.com/*'],
  },
  vite: ({ mode }) => ({
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : undefined,
    },
    plugins: [tailwindcss()],
  }),
  outDir: 'build',
  outDirTemplate: `v${process.env.npm_package_version}`,
})
