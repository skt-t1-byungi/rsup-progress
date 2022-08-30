interface Options {
    maxWidth?: number | string
    height?: number | string
    duration?: number
    hideDuration?: number
    zIndex?: number | string
    className?: string
    color?: string
    timing?: string
    position?: 'top' | 'bottom' | 'none'
    container?: HTMLElement
}

const enum STATE {
    DISAPPEAR = -1,
    NOTHING,
    APPEAR,
    PENDING,
    DISAPPEAR_RESTART,
}

const PERSIST_TIME = 150

export class Progress {
    private _el = document.createElement('div')
    private _state = STATE.NOTHING
    private _opts = {
        maxWidth: '99.8%',
        height: '4px',
        duration: 60000,
        hideDuration: 400,
        zIndex: '9999',
        color: '#ff1a59',
        className: '',
        timing: 'cubic-bezier(0,1,0,1)',
        position: 'top',
        container: document.body,
    }
    private _rafId: number | null = null
    private _timerId: ReturnType<typeof setTimeout> | null = null
    private _promises: Promise<any>[] = []
    private _delayTimers: ReturnType<typeof setTimeout>[] = []

    constructor(opts: Options = {}) {
        this.setOptions(opts)
    }

    setOptions(opts: Options) {
        if (isNumber(opts.maxWidth)) opts.maxWidth = opts.maxWidth + 'px'
        if (isNumber(opts.height)) opts.height = opts.height + 'px'
        if (isNumber(opts.zIndex)) opts.zIndex = String(opts.zIndex)

        const options = assign(this._opts, opts)
        this._el.className = options.className

        const style = {
            height: options.height,
            background: options.color,
            zIndex: options.zIndex,
            position: '',
            left: '',
            top: '',
            bottom: '',
        }
        switch (options.position) {
            case 'top':
                style.position = 'fixed'
                style.top = '0'
                style.left = '0'
                break
            case 'bottom':
                style.position = 'fixed'
                style.bottom = '0'
                style.left = '0'
                break
        }
        this._css(style)
    }

    private _css(style: Partial<CSSStyleDeclaration>) {
        assign(this._el.style, style)
    }

    get isInProgress() {
        return this._state > 0
    }

    start() {
        switch (this._state) {
            case STATE.APPEAR:
            case STATE.PENDING:
            case STATE.DISAPPEAR_RESTART:
                return
            case STATE.DISAPPEAR:
                this._state = STATE.DISAPPEAR_RESTART
                return
        }
        this._state = STATE.APPEAR

        const opts = this._opts
        const transition = `width ${opts.duration}ms ${opts.timing}`
        this._css({
            width: '0',
            opacity: '1',
            transition,
            webkitTransition: transition,
        })
        opts.container.appendChild(this._el)

        this._rafId = requestAnimationFrame(() => {
            this._rafId = requestAnimationFrame(() => {
                this._rafId = null
                this._state = STATE.PENDING
                this._css({ width: this._opts.maxWidth })
            })
        })
    }

    end(immediately = false) {
        this._promises = []
        this._delayTimers.splice(0).forEach(clearTimeout)

        switch (this._state) {
            case STATE.NOTHING:
                return
            case STATE.APPEAR:
                this._state = STATE.NOTHING
                cancelAnimationFrame(this._rafId!)
                this._rafId = null
                detach(this._el)
                return
            case STATE.DISAPPEAR:
            case STATE.DISAPPEAR_RESTART:
                if (immediately) {
                    this._state = STATE.NOTHING
                    clearTimeout(this._timerId!)
                    this._timerId = null
                    detach(this._el)
                } else {
                    this._state = STATE.DISAPPEAR
                }
                return
        }

        if (immediately) {
            this._state = STATE.NOTHING
            detach(this._el)
            return
        }
        this._state = STATE.DISAPPEAR

        const opts = this._opts
        const transition = `width 50ms, opacity ${opts.hideDuration}ms ${PERSIST_TIME}ms`
        this._css({
            width: '100%',
            opacity: '0',
            transition,
            webkitTransition: transition,
        })

        this._timerId = setTimeout(() => {
            this._timerId = null
            const restart = this._state === STATE.DISAPPEAR_RESTART
            this._state = STATE.NOTHING

            detach(this._el)
            if (restart) {
                this.start()
            }
        }, opts.hideDuration + PERSIST_TIME)
    }

    promise<T>(p: Promise<T>, { delay = 0, min = 100 } = {}) {
        let timerId: ReturnType<typeof setTimeout> | null

        const start = () => {
            if (min > 0) {
                p = Promise.all([p, new Promise(res => setTimeout(res, min))]).then(([v]) => v)
            }
            this._promises.push(p)
            this.start()
        }
        const cleanupTimer = () => {
            const timers = this._delayTimers
            timers.splice(timers.indexOf(timerId!) >>> 0, 1)
            timerId = null
        }
        if (delay > 0) {
            this._delayTimers.push(
                (timerId = setTimeout(() => {
                    cleanupTimer()
                    start()
                }, delay))
            )
        } else {
            start()
        }

        const onFinally = () => {
            if (timerId) {
                clearTimeout(timerId)
                cleanupTimer()
                return
            }
            const promises = this._promises
            const idx = promises.indexOf(p)
            if (~idx) {
                promises.splice(idx, 1)
                if (promises.length === 0) this.end()
            }
        }
        return p.then(
            val => (onFinally(), val),
            err => (onFinally(), Promise.reject(err))
        )
    }
}

function isNumber(v: any): v is number {
    return typeof v === 'number'
}

function assign<T1, T2>(target: T1, src: T2): T1 & T2 {
    for (const k in src) {
        if (Object.prototype.hasOwnProperty.call(src, k)) (target as any)[k] = src[k]
    }
    return target as T1 & T2
}

function detach(el: HTMLElement) {
    if (el.parentNode) el.parentNode.removeChild(el)
}
