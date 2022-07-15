import resolve from '@rollup/plugin-node-resolve'
import commonJs from '@rollup/plugin-commonjs'
import svelte from 'rollup-plugin-svelte'

const name = 'svelte-fontawesome'
const globals = {
  '@fortawesome/fontawesome-svg-core': 'FontAwesome'
}

export default {
  external: ['@fortawesome/fontawesome-svg-core'],
  input: 'src/index.js',
  output: [
    {
      name,
      globals,
      format: 'umd',
      file: 'index.js',
    },
    {
      name,
      globals,
      format: 'es',
      file: 'index.es.js',
    },
  ],
  plugins: [
    resolve({
      jsnext: true,
      main: true,
    }),
    commonJs(),
    svelte({
      exclude: 'node_modules/**',
      compilerOptions: {
        generate: 'ssr',
        hydratable: true
      }
    }),
  ],
}
