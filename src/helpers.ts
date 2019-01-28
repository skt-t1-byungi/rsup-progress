export function assert (val: any, name: string, expected: string) {
    const type = typeof val
    if (type !== expected) throw new TypeError(`Expected \`${name}\` to be of type "${expected}", but "${type}".`)
}

export function delay (ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
