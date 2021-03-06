import * as path from 'path'
import {uselib} from 'unistd'
import {mount} from 'sys/mount'
import Process from '../sys/kernel/process'

//require('source-map-support').install()

import '../sys/global'

const root = path.dirname(__dirname)

global['environ'] = {
  PATH: ['bin', 'usr/bin'].map(pathname => path.resolve(root, pathname)).join(':'),
  JSPATH: ['sys/module', 'node_modules', 'lib', 'usr/lib', 'usr/include'].map(pathname => path.resolve(root, pathname)).join(':'),
}
global['arguments'] = process.argv

uselib(path.join(root, 'lib/libio/local'))
uselib(path.join(root, 'sys/module/module'), 'module')
uselib('unistd')
uselib('stdlib')
uselib('signal')
uselib('sys/wait')

if (typeof process !== 'undefined') {
  process.on('unhandledRejection', (reason, promise) => { throw reason })
}

/*
mount(local, '/usr/local')
mount(__dirname, '/')
*/
