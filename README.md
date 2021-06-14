# Tweakpane essentials plugin
Essential components for [Tweakpane][tweakpane].


## Installation


### Browser
```html
<script src="tweakpane.min.js"></script>
<scirpt src="tweakpane-plugin-essentials.min.js"></script>
<script>
  const pane = new Tweakpane.Pane();
  pane.registerPlugin(TweakpaneEssentialsPlugin);
</script>
```


### Package
```js
import {Pane} from 'tweakpane';
import * as EssentialsPlugin from 'tweakpane-plugin-essentials';

const pane = new Pane();
pane.registerPlugin(EssentialsPlugin);
```


## Usage


### Interval
```js
const params = {
  range: {min: 16, max: 48},
};

pane.addInput(params, 'range', {
  min: 0,
  max: 100,

  step: 1,
});
```


### FPS graph
```js
const fpsGraph = pane.addBlade({
  view: 'fpsgraph',

  label: 'fpsgraph',
  lineCount: 2,
});

function render() {
  fpsGraph.begin();

  // Rendering

  fpsGraph.end();
  requestAnimationFrame(render);
}
```


### Radio grid
```js
const params = {
  scale: 25,
};

const scales = [10, 20, 25, 50, 75, 100];
pane.addInput(params, 'scale', {
  view: 'radiogrid',
  groupName: 'scale',
  size: [3, 2],
  cells: (x, y) => ({
    title: `${scales[y * 3 + x]}%`,
    value: scales[y * 3 + x],
  }),

  label: 'radiogrid',
}).on('change', (ev) => {
  console.log(ev);
});
```


### Button grid
```js
pane.addBlade({
  view: 'buttongrid',
  size: [3, 3],
  cells: (x, y) => ({
    title: [
      ['NW', 'N', 'NE'],
      ['W',  '*', 'E'],
      ['SW', 'S', 'SE'],
    ][y][x],
  }),
  label: 'buttongrid',
}).on('click', (ev) => {
  console.log(ev);
});
```


### Cubic bezier
```js
pane.addBlade({
  view: 'cubicbezier',
  value: [0.5, 0, 0.5, 1],

  expanded: true,
  label: 'cubicbezier',
  picker: 'inline',
}).on('click', (ev) => {
  console.log(ev);
});
```


[tweakpane]: https://github.com/cocopon/tweakpane/
