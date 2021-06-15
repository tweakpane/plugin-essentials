# Tweakpane essentials plugin
Essential components for [Tweakpane][tweakpane].

![](https://user-images.githubusercontent.com/602961/122059107-41ec8c80-ce27-11eb-9d17-08c522efb05f.png)


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
![interval](https://user-images.githubusercontent.com/602961/122065260-c261bc00-ce2c-11eb-914b-81dde7957c43.png)

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
![fpsgraph](https://user-images.githubusercontent.com/602961/122065296-c988ca00-ce2c-11eb-9907-65e62ea934cd.png)

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
![radiogrid](https://user-images.githubusercontent.com/602961/122065318-ce4d7e00-ce2c-11eb-8f04-e05760e118d9.png)

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
![buttongrid](https://user-images.githubusercontent.com/602961/122065349-d5748c00-ce2c-11eb-8538-c2a0ae6aaab4.png)

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
![cubicbezier](https://user-images.githubusercontent.com/602961/122065367-d9a0a980-ce2c-11eb-8f20-f93876a21ce2.png)

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
