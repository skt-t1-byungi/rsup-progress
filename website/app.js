import {Progress} from '../src/'

const progress = new Progress({maxDuration: 60000, hideDuration: 1000})

progress.start()

window.progress = progress
