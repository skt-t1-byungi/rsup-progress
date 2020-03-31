interface UserOptions {
    maxWidth?: number | string;
    height?: number | string;
    duration?: number;
    hideDuration?: number;
    zIndex?: number | string;
    className?: string;
    color?: string;
    timing?: string;
    position?: 'top' | 'bottom' | 'none';
    container?: HTMLElement;
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
    position: 'top' | 'bottom' | 'none';
    container: HTMLElement;
}

const PERSIST_TIME = 150

class Progress {
    static default = Progress // for compatibility

    private _el: HTMLDivElement
    private _opts!: Options
    private _isInProgress = false
    private _isHiding = false
    private _willRestart = false
    private _rafId: number | null = null
    private _promises: Array<Promise<any>> = []

    constructor (userOpts: UserOptions = {}) {
        this._el = document.createElement('div')
        this.setOptions(userOpts)
    }

    setOptions (userOpts: UserOptions) {
        assertPropType(userOpts, 'maxWidth', ['number', 'string'])
        assertPropType(userOpts, 'height', ['number', 'string'])
        assertPropType(userOpts, 'duration', 'number')
        assertPropType(userOpts, 'hideDuration', 'number')
        assertPropType(userOpts, 'zIndex', ['number', 'string'])
        assertPropType(userOpts, 'className', 'string')
        assertPropType(userOpts, 'color', 'string')
        assertPropType(userOpts, 'timing', 'string')

        if (userOpts.position && !~['top', 'bottom', 'none'].indexOf(userOpts.position)) {
            throw new TypeError(`Expected "position" to be [top|bottom|none], but "${userOpts.position}".`)
        }
        if (userOpts.container && !(userOpts.container instanceof HTMLElement)) {
            throw new TypeError('Expected "container" to be [HTMLElement] type.')
        }

        const opts = this._opts = normalizeOptions(userOpts)

        this._el.className = opts.className
        this._css({
            height: opts.height,
            background: opts.color,
            zIndex: opts.zIndex
        })
        this._css(opts.position === 'none' ? {
            position: '',
            left: '',
            top: '',
            bottom: ''
        } : {
            position: 'fixed',
            left: '0',
            top: opts.position === 'top' ? '0' : '',
            bottom: opts.position === 'bottom' ? '0' : ''
        })
    }

    private _css (style: Partial<CSSStyleDeclaration>) {
        assign(this._el.style, style)
    }

    /**
     * @deprecated
     */
    get isProgress () {
        return this._isInProgress
    }

    get isInProgress () {
        return this._isInProgress
    }

    start () {
        if (this._isInProgress) {
            if (this._isHiding) this._willRestart = true
            return
        }

        this._isInProgress = true

        const transition = `width ${this._opts.duration}ms ${this._opts.timing}`
        this._css({
            width: '0',
            opacity: '1',
            transition,
            webkitTransition: transition
        })

        this._opts.container.appendChild(this._el)

        this._nextFrame(() => this._css({ width: this._opts.maxWidth }))
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
        if (!this._isInProgress || (this._isHiding && !immediately)) return

        if (immediately || this._rafId) {
            if (this._rafId) {
                cancelAnimationFrame(this._rafId)
                this._rafId = null
            }

            this._isInProgress = false
            this._isHiding = false

            return detach(this._el)
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
            this._isInProgress = false

            detach(this._el)

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
                return clearTimeout(timerId)
            }
            const promises = this._promises
            const idx = promises.indexOf(promise)
            if (~idx) {
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
        timing: 'cubic-bezier(0,1,0,1)',
        position: 'top',
        container: document.body
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

function assertPropType (o: any, prop: string, expected: string | string[]) {
    const type = typeof o[prop]
    if (type === 'undefined') return
    if (typeof expected === 'string') expected = [expected]
    if (~expected.indexOf(type)) return
    throw new TypeError(`Expected "${prop}" to be of type [${expected.join('|')}], but "${type}".`)
}

function detach (el: HTMLElement) {
    if (el.parentNode) el.parentNode.removeChild(el)
}
