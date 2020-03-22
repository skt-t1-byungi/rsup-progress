import { pDelay } from '@byungi/p-delay'

import Progress from '../src'

(window as any).progress = new Progress({ height: 5 });
(window as any).delay = pDelay
