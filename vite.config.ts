import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      // Ponto de entrada da sua aplicação
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Avizar',
      // O nome dos arquivos gerados (avizar.js, avizar.umd.cjs)
      fileName: 'avizar',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // Se você não tem dependências externas como React ou Vue, 
      // pode deixar o array vazio.
      external: [],
      output: {
        globals: {
          // Nome global para o formato UMD
          Avizar: 'Avizar',
        },
      },
    },
    // Garante que o CSS seja extraído para um arquivo separado
    cssCodeSplit: false,
  },
  plugins: [
    dts({ 
      insertTypesEntry: true,
      rollupTypes: true // Consolida todos os tipos em um único arquivo .d.ts
    })
  ],
});