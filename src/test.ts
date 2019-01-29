import test from 'tape'
import { Progress } from './index'

declare const puppet: any
test.onFinish(() => puppet.exit(0));
(test as any).onFailure(() => puppet.exit(1))

const $ = (selector: string) => document.querySelector(selector)
const clear = () => (document.body.innerHTML = '')
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

test('attach dom', t => {
    const progress = new Progress({ className: 'bar' })

    t.notOk($('.bar'))
    progress.start()
    t.ok($('.bar'))
    progress.end()
    t.notOk($('.bar'))

    clear(), t.end()
})

test('progress', t => {
    const progress = new Progress({ className: 'bar' })
    progress.start()
    t.is($('.bar').getBoundingClientRect().width, 0)

    delay(100).then(() => {
        t.ok($('.bar').getBoundingClientRect().width > 0)
        clear(), t.end()
    })
})
