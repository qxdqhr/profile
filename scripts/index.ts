import type { ConfigEnv, UserConfig } from 'vite';

import merge from 'deepmerge';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Configure } from './types';

import { createPlugins } from './plugins';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 用deepmerge来深度合并默认配置和自定义配置
// 自定义配置是在vite.config.ts中调用本函数时传入的confgiure参数（一个用于生成vite配置的函数）执行后的结果
export const createConfig = (params: ConfigEnv, configure?: Configure): UserConfig => {
    const isBuild = params.command === 'build';
    return merge<UserConfig>(
        {
            build: {
                rollupOptions: {
                    output: {
                        manualChunks: {
                            vendor: ['react', 'react-dom'],
                            libs: ['deepmerge'],
                        },
                    },
                },
            },
            resolve: {
                alias: {
                    '@': resolve(__dirname, '../src'),
                },
            },
            css: {
                modules: {
                    localsConvention: 'camelCaseOnly',
                },
            },
            plugins: createPlugins(isBuild),
        },
        typeof configure === 'function' ? configure(params, isBuild) : {},
        {
            arrayMerge: (_d, s, _o) => Array.from(new Set([..._d, ...s])),
        },
    );
};
