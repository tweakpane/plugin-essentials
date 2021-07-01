'use strict';

const Package = require('../package.json');

// `@tweakpane/plugin-foobar` -> `tweakpane-plugin-foobar`
// `tweakpane-plugin-foobar`  -> `tweakpane-plugin-foobar`
const name = Package.name
	.split(/[@/-]/)
	.reduce((comps, comp) => (comp !== '' ? [...comps, comp] : comps), [])
	.join('-');
console.log(name);
