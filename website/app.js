import {Progress} from '../src/'

const progress = new Progress({duration: 60000, hideDuration: 1000, height: 5, color:'blue'})

progress.start()

window.progress = progress
