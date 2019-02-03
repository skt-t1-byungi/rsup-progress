<h1 align="center">
    <img src="./logo.png">
</h1>

> A simple progressbar that supports promise.

[![npm](https://flat.badgen.net/npm/v/rsup-prgoress)](https://www.npmjs.com/package/rsup-progress)
[![npm](https://flat.badgen.net/npm/license/rsup-prgoress)](#LICENSE)

Progress bar speed is fast at first, but it slows down and does not end. Call the `end` function to complete.<br>
Users experience interaction with smooth animation without progress information.

https://skt-t1-byungi.github.io/rsup-progress/

## Example
Library import and instance creation.
```js
import Progress from 'rsup-progress'

const progress = new Progress()
```

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

## API
### new Progress([options])
Create instance.
```js
const progress = new Progress({
    height: 5,
    color: '#33eafd',
})
```

#### options
- `maxWidth` - Maximum width before completion. Default is `99.8%`.
- `height` - Progress bar height. Default is `4px`.
- `duration` - Duration time to reach maxWidth. Default is `60000`(ms).
- `hideDuration` - Duration time to hide when completion. Default is `400`(ms).
- `zIndex` - CSS z-index property. Default is `9999`.
- `className` - Progress bar className attribute.
- `color` - Progress bar color. Default is `#ff1a59`.
- `timing` - Animation timing function. Default is `cubic-bezier(0,1,0,1)`.

### promise.setOptions(options)
Change options.
```js
progress.setOptions({
    color: 'red',
    className: 'class1 class2'
})
```

### promise.isProgress
Returns whether it is in progress or not.
```js
console.log(progress.isProgress) // => false

progress.start()

console.log(progress.isProgress) // => true
```

### progress.start()
Start the progress bar.

### progress.end([immediately])
Complete the progress bar. If immediately is true, remove the element immediately.

### progress.promise(promise[, delay])
Call the start and end functions automatically by promise.
```js
const response = await progress.promise(fetch('/data.json'))
```

If `delay` is given, it starts after a delay.

```js
progress.promise(delay(500), 200) // => It starts 200ms later.
```

If the promise ends before the delay, the progress bar will not start.
```js
progress.promise(delay(500), 600) // => Progress bar does not appear.
```



## License
MIT License ❤️📝 skt-t1-byungi
