import Progress from '../src'
;(window as any).progress = new Progress({ height: 5 })
;(window as any).delay = (ms: number) => new Promise(res => setTimeout(res, ms))
