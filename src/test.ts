import test from 'tape'
import { Progress } from './index'

declare const puppet: any
test.onFinish(() => puppet.exit(0));
(test as any).onFailure(() => puppet.exit(1))

const $ = (selector: string) => document.querySelector(selector)
const clear = () => (document.body.innerHTML = '')
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

test('attach element', t => {
    const progress = new Progress({ className: 'bar' })

    t.notOk($('.bar'))
    progress.start()
    t.ok($('.bar'))
    progress.end()
    t.notOk($('.bar'))

    clear(), t.end()
})

test('progress', t => {
    const progress = new Progress({ className: 'bar', duration: 200, maxWidth: 100 })
    const getWidth = () => $('.bar').getBoundingClientRect().width

    progress.start()
    t.is(getWidth(), 0)

    delay(100).then(() => {
        const w = getWidth()
        t.ok(0 < w && w < 100)

        delay(100).then(() => {
            t.is(getWidth(), 100)

            delay(50).then(() => {
                t.is(getWidth(), 100)
                clear(), t.end()
            })
        })
    })
})

test('promise', t => {
    const progress = new Progress({ hideDuration: 0 })

    progress.promise(delay(100))
    t.ok(progress.isProgress)

    const PERSIST_TIME = 150
    delay(105 + PERSIST_TIME).then(() => {
        t.notOk(progress.isProgress)
        clear(), t.end()
    })
})

test('promise # add When added midway', t => {
    t.plan(3)
    const progress = new Progress({ hideDuration: 0 })

    progress.promise(delay(100))
    t.ok(progress.isProgress)

    delay(80).then(() => progress.promise(delay(100)))

    const PERSIST_TIME = 150
    delay(105 + PERSIST_TIME).then(() => t.ok(progress.isProgress))
    delay(185 + PERSIST_TIME).then(() => {
        t.notOk(progress.isProgress)
        clear(), t.end()
    })
})
