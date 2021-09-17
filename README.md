# Tweakpane essentials plugin
Essential components for [Tweakpane][tweakpane].

![](https://user-images.githubusercontent.com/602961/122059107-41ec8c80-ce27-11eb-9d17-08c522efb05f.png)


## Installation


### Browser
```html
<script src="tweakpane.min.js"></script>
<script src="tweakpane-plugin-essentials.min.js"></script>
<script>
  const pane = new Tweakpane.Pane();
  pane.registerPlugin(TweakpaneEssentialsPlugin);
</script>
```


### Package
```js
import {Pane} from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

const pane = new Pane();
pane.registerPlugin(EssentialsPlugin);
```


## Usage


### Interval
![interval](https://user-images.githubusercontent.com/602961/128586465-53231349-ac65-43ca-ba21-67c427d0bacf.png)

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
![fpsgraph](https://user-images.githubusercontent.com/602961/128586477-be5dbd1e-af7f-4526-8bb7-4824d04b57d7.png)

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
![radiogrid](https://user-images.githubusercontent.com/602961/128586503-1935b021-3811-4ec4-8457-a47cbe1b31f2.png)

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
![buttongrid](https://user-images.githubusercontent.com/602961/128586516-e453b14b-f471-4cdc-b2aa-c52b2317e0c1.png)

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
![cubicbezier](https://user-images.githubusercontent.com/602961/128586524-369cf186-b4fa-4aaa-8a4f-92aaa7583490.png)

```js
pane.addBlade({
  view: 'cubicbezier',
  value: [0.5, 0, 0.5, 1],

  expanded: true,
  label: 'cubicbezier',
  picker: 'inline',
}).on('change', (ev) => {
  console.log(ev);
});
```


[tweakpane]: https://github.com/cocopon/tweakpane/
