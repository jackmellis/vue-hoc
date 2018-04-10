import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/vue-hoc.js',
      format: 'cjs',
      exports: 'named',
    },
    {
      file: 'dist/vue-hoc.es.js',
      format: 'es',
      exports: 'named',
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  external: ['vue']
};
