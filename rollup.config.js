import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

const config = defineConfig({
  input: 'src/Lowlight.js',
  plugins: [
    resolve(),
    commonjs()
  ],
  external: ['react', 'prop-types', 'lowlight'],
  output: [
    {
      file: 'dist/lowlight.js',
      format: 'esm'
    },
    {
      file: 'dist/lowlight.umd.js',
      format: 'umd',
      name: 'ReactLowlight',
      globals: {
        react: 'react',
        'prop-types': 'PropTypes',
        lowlight: 'lowlight'
      }
    }
  ]
})

export default config
