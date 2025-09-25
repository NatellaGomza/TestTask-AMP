import { viteMockServe } from 'vite-plugin-mock';
import {defineConfig} from "vite";

export default defineConfig({
  plugins: [
    viteMockServe({
      mockPath: 'mock',
    }),
  ],
});

