interface UserOptions {
    maxWidth?: number | string;
    height?: number | string;
    duration?: number;
    hideDuration?: number;
    zIndex?: number | string;
    className?: string;
    color?: string;
    timing?: string;
}

interface Options {
    maxWidth: string;
    height: string;
    duration: number;
    hideDuration: number;
    zIndex: string;
    className: string;
    color: string;
    timing: string;
}

const PERSIST_TIME = 150

class Progress {
    static default = Progress // for compatibility

    private _el: HTMLDivElement
    private _opts!: Options
    private _isProgress = false
    private _isHiding = false
    private _willRestart = false
    private _rafId: number | null = null
    private _promises: Array<Promise<any>> = []

    constructor (userOpts: UserOptions = {}) {
        this._el = document.createElement('div')
        this.setOptions(userOpts)
    }

    setOptions (userOpts: UserOptions) {
        assertProp(userOpts, 'maxWidth', ['number', 'string'])
        assertProp(userOpts, 'height', ['number', 'string'])
        assertProp(userOpts, 'duration', 'number')
        assertProp(userOpts, 'hideDuration', 'number')
        assertProp(userOpts, 'zIndex', ['number', 'string'])
        assertProp(userOpts, 'className', 'string')
        assertProp(userOpts, 'color', 'string')
        assertProp(userOpts, 'timing', 'string')

        const opts = this._opts = normalizeOptions(userOpts)

        this._el.className = opts.className
        this._css({
            position: 'fixed',
            zIndex: opts.zIndex,
            top: '0',
            left: '0',
            height: opts.height,
            background: opts.color
        })
    }

    private _css (style: Partial<CSSStyleDeclaration>) {
        assign(this._el.style, style)
    }

    get isProgress () {
        return this._isProgress
    }

    start () {
        if (this._isProgress) {
            if (this._isHiding) this._willRestart = true
            return
        }

        this._isProgress = true

        const transition = `width ${this._opts.duration}ms ${this._opts.timing}`
        this._css({
            width: '0',
            opacity: '1',
            transition,
            webkitTransition: transition
        })

        document.body.appendChild(this._el)

        this._nextFrame(() => {
            if (this._isHiding) return
            this._css({ width: this._opts.maxWidth })
        })
    }

    private _nextFrame (cb: () => void) {
        this._rafId = requestAnimationFrame(() => (
            this._rafId = requestAnimationFrame(() => {
                this._rafId = null
                cb()
            })
        ))
    }

    end (immediately?: boolean) {
        this._promises = []

        if (this._willRestart) this._willRestart = false
        if (!this._isProgress || (this._isHiding && !immediately)) return

        if (immediately || this._rafId) {
            if (this._rafId) {
                cancelAnimationFrame(this._rafId)
                this._rafId = null
            }

            this._isProgress = false
            this._isHiding = false
            return void document.body.removeChild(this._el)
        }

        this._isHiding = true

        const transition = `width 50ms, opacity ${this._opts.hideDuration}ms ${PERSIST_TIME}ms`
        this._css({
            width: '100%',
            opacity: '0',
            transition,
            webkitTransition: transition
        })

        setTimeout(() => {
            if (!this._isHiding) return

            this._isHiding = false
            this._isProgress = false
            document.body.removeChild(this._el)

            if (this._willRestart) {
                this._willRestart = false
                this.start()
            }
        }, this._opts.hideDuration + PERSIST_TIME)
    }

    promise<T> (promise: Promise<T>, delay = 0) {
        let timerId: number | null = null

        const start = () => {
            timerId = null
            this._promises.push(promise)
            this.start()
        }

        if (delay > 0) {
            timerId = setTimeout(start, delay)
        } else {
            start()
        }

        const onFinally = () => {
            if (timerId) {
                return void clearTimeout(timerId)
            }

            const promises = this._promises
            const idx = promises.indexOf(promise)

            if (idx > -1) {
                promises.splice(idx, 1)
                if (promises.length === 0) this.end()
            }
        }

        return promise.then(
            v => (onFinally(), v),
            err => (onFinally(), Promise.reject(err))
        )
    }
}

export default Progress

function normalizeOptions (opts: UserOptions): Options {
    opts = assign({
        maxWidth: '99.8%',
        height: '4px',
        duration: 60000,
        hideDuration: 400,
        zIndex: '9999',
        color: '#ff1a59',
        className: '',
        timing: 'cubic-bezier(0,1,0,1)'
    }, opts)

    if (typeof opts.maxWidth === 'number') opts.maxWidth = opts.maxWidth + 'px'
    if (typeof opts.height === 'number') opts.height = opts.height + 'px'
    if (typeof opts.zIndex === 'number') opts.zIndex = String(opts.zIndex)

    return opts as Options
}

function assign<T1, T2> (t: T1, src: T2): T1 & T2 {
    for (const k in src) {
        if (Object.prototype.hasOwnProperty.call(src, k)) (t as any)[k] = src[k]
    }
    return t as T1 & T2
}

function assertProp (o: any, prop: string, expected: string | string[]) {
    const type = typeof o[prop]
    if (type === 'undefined') return
    if (typeof expected === 'string') expected = [expected]
    if (expected.indexOf(type) > -1) return

    throw new TypeError(`[rsup-progress] Expected \`${prop}\` to be of type ${expected.join(', ')}, but "${type}".`)
}
