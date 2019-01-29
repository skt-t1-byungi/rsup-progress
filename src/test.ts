import test from 'tape'
import { Progress } from './index'

declare const puppet: any
test.onFinish(() => puppet.exit(0));
(test as any).onFailure(() => puppet.exit(1))

const $ = document.querySelector.bind(document)
const clear = () => (document.body.innerHTML = '')

test('basic', t => {
    const progress = new Progress({ className: 'bar' })

    t.notOk($('.bar'))
    progress.start()
    t.ok($('.bar'))

    clear()
    t.end()
})
