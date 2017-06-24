import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript2';

const babelConf = {
	exclude: 'node_modules/**'
}

export default {
	entry: './src/index.ts',
	moduleName: 'GeeTailor',
	dest: './dist/GeeTailor.js',
	format: 'umd',
    sourceMap: true,
	plugins: [
        typescript(),
        uglify(),
        resolve(),
	]
}