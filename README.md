<div align="center">
    <img src="./logo.png">
</div>
<br><br>

> A simple(1KB) progress bar with promises support

[![npm](https://flat.badgen.net/npm/v/rsup-progress)](https://www.npmjs.com/package/rsup-progress)
[![npm](https://flat.badgen.net/bundlephobia/minzip/rsup-progress)](https://bundlephobia.com/result?p=rsup-progress)
[![npm](https://flat.badgen.net/npm/license/rsup-progress)](https://github.com/skt-t1-byungi/rsup-progress/blob/master/LICENSE)

The progress bar is initially fast, but doesn't end as it slows down.
Call the `end` function to complete. <br>
This gives users a natural animation without the exact percentage of progress.

https://skt-t1-byungi.github.io/rsup-progress/

## Example
Example using `start`, `end` method.
```js
progress.start()

fetch('/data.json').then(response => {
    progress.end()
})
```

Using `promise` method.
```js
const response = await progress.promise(fetch('/data.json'))
```

## Install
```sh
npm i rsup-progress
```
```js
import { Progress } from 'rsup-progress'
```

### Browser ESM
```html
<script type="module">
    import { Progress } from 'https://unpkg.com/rsup-progress/dist/esm/index.js';
    const progress = new Progress()
</script>
```

## API
### new Progress(options?)
Create instance.
```js
const progress = new Progress({
    height: 5,
    color: '#33eafd',
})
```

#### options
- `height` - Progress bar height. Default is `4px`.
- `className` - Progress bar `class` attribute.
- `color` - Progress bar color. Default is `#ff1a59`.
- `container` - Element to append a progress bar. Default is `document.body`.
- `maxWidth` - Maximum width before completion. Default is `99.8%`.
- `position` - Position to be placed. Default is `top` (There are `top`, `bottom`, `none`).
- `duration` - Time to reach maxWidth. Default is `60000`(ms).
- `hideDuration` - Time to hide when completion. Default is `400`(ms).
- `zIndex` - CSS z-index property. Default is `9999`.
- `timing` - CSS animation timing function. Default is `cubic-bezier(0,1,0,1)`.

### progress.setOptions(options)
Change options.
```js
progress.setOptions({
    color: 'red',
    className: 'class1 class2'
})
```

### progress.isInProgress
Returns whether it is in progress or not.
```js
console.log(progress.isInProgress) // => false

progress.start()

console.log(progress.isInProgress) // => true
```

### progress.start()
Start the progress bar.

### progress.end(immediately = false)
Complete the progress bar. If `immediately` is true, remove the element immediately.

### progress.promise(promise, options?)
Call the start and end functions automatically by promise.
```js
const response = await progress.promise(fetch('/data.json'))
```

#### options.min
Minimum time to show and maintain the progressbar. Default is `100`ms. If `0` is given and promise is already resolved, the progressbar does not appear.

```js
progress.promise(Promise.resolve(), { min: 0 }) // => Progress bar does not appear.
```

#### options.delay
If `options.delay` is given, it starts after a delay.

```js
progress.promise(delay(500), { delay: 200 }) // => It starts 200ms later.
```

If the promise ends before the delay, the progress bar will not start.
```js
progress.promise(delay(500), { delay: 600 }) // => Progress bar does not appear.
```

It is useful when avoiding the progressbar flash that occurs when the promise is short.

## License
MIT License ❤️📝 skt-t1-byungi
