// tslint:disable: no-floating-promises
import tape from 'tape'
import { Progress } from './index'

declare const puppet: any
tape.onFinish(() => puppet.exit(0));
(tape as any).onFailure(() => puppet.exit(1))

const test = (name: string, tester: (t: any) => void) => tape(name, t => {
    const tEnd = t.end
    t.end = () => {
        document.body.innerHTML = ''
        return tEnd.call(t)
    }
    return tester(t)
})

const $ = (selector: string) => document.querySelector(selector)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const PERSIST_TIME = 150

test('attach element.', t => {
    const progress = new Progress({ className: 'bar' })

    t.notOk($('.bar'))
    progress.start()
    t.ok($('.bar'))
    progress.end()
    t.notOk($('.bar'))

    t.end()
})

test('progress to reach maxWidth.', t => {
    const progress = new Progress({ className: 'bar', duration: 200, maxWidth: 100 })
    const getWidth = () => $('.bar').getBoundingClientRect().width

    progress.start()
    t.is(getWidth(), 0)

    delay(100).then(() => {
        const w = getWidth()
        t.true(0 < w && w < 100)

        delay(100).then(() => {
            t.is(getWidth(), 100)

            delay(50).then(() => {
                t.is(getWidth(), 100)
                t.end()
            })
        })
    })
})

test('basic promise.', t => {
    const progress = new Progress({ hideDuration: 0 })

    progress.promise(delay(100))
    t.true(progress.isProgress)

    delay(105 + PERSIST_TIME).then(() => {
        t.false(progress.isProgress)
        t.end()
    })
})

test('When rejected, the progress should be finalized.', t => {
    const progress = new Progress({ hideDuration: 0 })

    t.plan(3)
    progress.promise(delay(100).then(() => { throw new Error('throw') }))
        .catch(() => t.pass())

    t.true(progress.isProgress)

    const PERSIST_TIME = 150
    delay(105 + PERSIST_TIME).then(() => {
        t.false(progress.isProgress)
        t.end()
    })
})

test('When a new promise is added, it is completed when the last promise is over.', t => {
    t.plan(3)
    const progress = new Progress({ hideDuration: 0 })

    progress.promise(delay(100))
    t.ok(progress.isProgress)

    delay(80).then(() => progress.promise(delay(100)))

    const PERSIST_TIME = 150
    delay(105 + PERSIST_TIME).then(() => t.ok(progress.isProgress))
    delay(185 + PERSIST_TIME).then(() => {
        t.notOk(progress.isProgress)
        t.end()
    })
})

test('Ignore promise that has not started.', t => {
    const progress = new Progress({ hideDuration: 0 })

    progress.promise(delay(100))
    progress.promise(delay(200), 200)

    delay(150 + PERSIST_TIME).then(() => {
        t.false(progress.isProgress)
        t.end()
    })
})

test('Without the promise delay argument, the progress bar should appear even if the promise ends prematurely.', t => {
    const progress = new Progress({ className: 'bar', hideDuration: 50 })
    progress.promise(delay(0)).then(() => {
        t.ok($('.bar'))
        t.true(progress.isProgress)

        delay(PERSIST_TIME).then(() => {
            t.is($('.bar').getBoundingClientRect().width, window.innerWidth) // 100%

            delay(50).then(() => {
                t.notOk($('.bar'))
                t.false(progress.isProgress)
                t.end()
            })
        })
    })
})
