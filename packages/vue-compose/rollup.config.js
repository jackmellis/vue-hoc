import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/vue-compose.js',
      format: 'cjs',
      exports: 'named',
    },
    {
      file: 'dist/vue-compose.es.js',
      format: 'es',
      exports: 'named',
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  external: ['vue-hoc']
};
