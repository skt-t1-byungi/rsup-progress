export type UserOptions = Partial<{
    maxWidth: number | string,
    height: number | string,
    maxDuration: number,
    hideDuration: number,
    zIndex: number | string,
    className: string | string[],
    color: string
}>

export interface Options {
    maxWidth: string,
    height: string,
    maxDuration: number,
    hideDuration: number,
    zIndex: string,
    className: string,
    color: string
}

export function normalizeOptions (opts: UserOptions): Options {
    opts = Object.assign({
        maxWidth: '99.5%',
        height: '3px',
        maxDuration: 60000,
        hideDuration: 400,
        zIndex: '9999',
        color: '#ff1a59',
        className: ''
    }, opts)

    if (typeof opts.maxWidth === 'number') opts.maxWidth = opts.maxWidth + 'px'
    if (typeof opts.height === 'number') opts.height = opts.height + 'px'
    if (typeof opts.zIndex === 'number') opts.zIndex = String(opts.zIndex)
    if (Array.isArray(opts.className)) opts.className = opts.className.join(' ')

    assert(opts.maxWidth, 'options.maxWidth', 'string')
    assert(opts.height, 'options.height', 'string')
    assert(opts.maxDuration, 'options.maxDuration', 'number')
    assert(opts.hideDuration, 'options.hideDuration', 'number')
    assert(opts.zIndex, 'options.zIndex', 'string')
    assert(opts.className, 'options.className', 'string')
    assert(opts.color, 'options.color', 'string')

    return opts as Options
}

function assert (val: any, name: string, expected: string) {
    const type = typeof val
    if (type !== expected) throw new TypeError(`Expected \`${name}\` to be of type "${expected}", but "${type}".`)
}

export function delay (ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
