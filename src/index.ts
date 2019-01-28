type UserOptions = Partial<{
    maxWidth: number | string,
    height: number | string,
    maxDuration: number,
    hideDuration: number,
    zIndex: number,
    className: string | string[],
    color: string
}>

interface Options {
    maxWidth: string,
    height: string,
    maxDuration: number,
    hideDuration: number,
    zIndex: number,
    className: string | string[],
    color: string
}

class RsupProgress {
    private _opts: Options
    private _el: HTMLDivElement
    private _onReady: Promise<void> | null

    constructor (opts: UserOptions = {}) {
        this._opts = normalizeOptions(opts)
        this._el = document.body.appendChild(createBarElement(this._opts))
        this._onReady = new Promise(resolve => requestAnimationFrame(resolve as () => void))
            .then(() => { this._onReady = null })
    }

    public start () {
        if (this._onReady) {
            this._onReady.then(this.start.bind(this))
            return
        }

        css(this._el, {
            width: '100%',
            opacity: '1',
            transition: `width ${this._opts.maxDuration}ms cubic-bezier(0,1,0,1)`
        })
    }

    public end () {
        css(this._el, {
            width: '100%',
            opacity: '1',
            transitionProperty: 'width'
        })
    }
}

export default (opts: UserOptions) => new RsupProgress(opts)

function normalizeOptions (opts: UserOptions): Options {
    opts = Object.assign({
        maxWidth: 'calc(99% - 2px)',
        height: '3px',
        maxDuration: 60000,
        hideDuration: 400,
        zIndex: 9999,
        color: '#ff1a59'
    }, opts)

    if (typeof opts.height === 'number') opts.height = opts.height + 'px'

    return opts as Options
}

function createBarElement (opts: Options) {
    const el = document.createElement('div')

    if (opts.className) {
        ([] as string[]).concat(opts.className).forEach(className => el.classList.add(className))
    }

    return css(el, {
        position: 'fixed',
        zIndex: String(opts.zIndex),
        opacity: '0',
        top: '0',
        left: '0',
        width: '0',
        height: opts.height,
        background: opts.color
    })
}

function css<T extends HTMLElement> (el: T, style: Partial<CSSStyleDeclaration> = {}) {
    Object.assign(el.style, style)
    return el
}
