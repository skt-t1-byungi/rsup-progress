<div align="center">
    <img src="./logo.png">
</div>
<br><br>

> A lightweight (1KB) progress bar with promise support

[![npm](https://flat.badgen.net/npm/v/rsup-progress)](https://www.npmjs.com/package/rsup-progress)
[![npm](https://flat.badgen.net/bundlephobia/minzip/rsup-progress)](https://bundlephobia.com/result?p=rsup-progress)
[![npm](https://flat.badgen.net/npm/license/rsup-progress)](https://github.com/skt-t1-byungi/rsup-progress/blob/master/LICENSE)

The progress bar starts quickly but decelerates over time. Invoke the `end` function to finish the animation, providing a natural user experience without an exact percentage of progress.

https://skt-t1-byungi.github.io/rsup-progress/

## Example

Using `start` and `end` methods.

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
npm install rsup-progress
```

```js
import { Progress } from 'rsup-progress'
```

### Browser ESM

```html
<script type="module">
    import { Progress } from 'https://unpkg.com/rsup-progress/dist/esm/index.js'
    const progress = new Progress()
</script>
```

## API

### new Progress(options?)

Create an instance.

```js
const progress = new Progress({
    height: 5,
    color: '#33eafd',
})
```

#### options

-   `height` - Progress bar height. Default is `4px`.
-   `className` - `class` attribute for the progress bar.
-   `color` - Progress bar color. Default is `#ff1a59`.
-   `container` - Element to append a progress bar. Default is `document.body`.
-   `maxWidth` - Maximum width before completion. Default is `99.8%`.
-   `position` - Position to be placed. Default is `top` (There are `top`, `bottom`, `none`).
-   `duration` - Time to reach maxWidth. Default is `60000`(ms).
-   `hideDuration` - Time to hide when completion. Default is `400`(ms).
-   `zIndex` - CSS z-index property. Default is `9999`.
-   `timing` - CSS animation timing function. Default is `cubic-bezier(0,1,0,1)`.

### progress.setOptions(options)

Change the options.

```js
progress.setOptions({
    color: 'red',
    className: 'class1 class2',
})
```

### progress.isInProgress

Check whether the progress bar is active.

```js
console.log(progress.isInProgress) // => false

progress.start()

console.log(progress.isInProgress) // => true
```

### progress.start()

Activate the progress bar.

### progress.end(immediately = false)

Complete the progress bar. If `immediately` is set to true, the element is removed instantly.

### progress.promise(promise, options?)

Automatically call start and end methods based on the given promise.

```js
const response = await progress.promise(fetch('/data.json'))
```

#### options.min

Minimum time to display and maintain the progress bar. Default is `100` ms. If `0` is set and the promise is already resolved, the progress bar won't appear.

```js
progress.promise(Promise.resolve(), { min: 0 }) // => Progress bar does not appear.
```

#### options.delay

If `options.delay` is set, the progress bar will start after the specified delay.

```js
progress.promise(delay(500), { delay: 200 }) // => It starts 200ms later.
```

If the promise resolves before the delay, the progress bar won't appear.

```js
progress.promise(delay(500), { delay: 600 }) // => Progress bar does not appear.
```

This is useful to prevent "flashing" of the progress bar for short-lived promises.

#### options.waitAnimation

If `options.waitAnimation` is set, the returned promise waits for the hide animation to complete.

```js
await progress.promise(fetch('/data.json'), { waitAnimation: true })

alert('Complete!')
```

Useful for immediate actions like `alert` or `confirm`. Default is `false`.

## License

MIT License ❤️📝 skt-t1-byungi
