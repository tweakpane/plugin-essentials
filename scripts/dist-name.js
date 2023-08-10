/* eslint-disable no-console */
/* eslint-env node */

import Fs from 'fs';

const Package = JSON.parse(
	Fs.readFileSync(new URL('../package.json', import.meta.url)),
);

// `@tweakpane/plugin-foobar` -> `tweakpane-plugin-foobar`
// `tweakpane-plugin-foobar`  -> `tweakpane-plugin-foobar`
const name = Package.name
	.split(/[@/-]/)
	.reduce((comps, comp) => (comp !== '' ? [...comps, comp] : comps), [])
	.join('-');
console.log(name);
