import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            // Ponto de entrada da sua aplicação
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Avizar',
            // O nome dos arquivos gerados (avizar.js, avizar.umd.cjs)
            formats: ['es', 'iife'],
            fileName: (format) => {
                if (format === 'es') return 'avizar.esm.js'; // Para quem usa import/export
                return 'avizar.min.js'; // O arquivo "limpo" para o iniciante no CDN
            },
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
                exports: 'named',
                footer: 'if (typeof window !== "undefined" && window.Avizar && window.Avizar.default) { window.Avizar = window.Avizar.default; }'
            },
        },
        // Garante que o CSS seja extraído para um arquivo separado
        cssCodeSplit: false,
    },
    plugins: [
        cssInjectedByJsPlugin(), // <--- Adicione isso
        dts({
            insertTypesEntry: true,
            rollupTypes: true // Consolida todos os tipos em um único arquivo .d.ts
        })
    ]
});