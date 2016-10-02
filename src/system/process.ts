import {EventEmitter} from 'events'
import {Zone} from 'zone.js'
import {IDMap} from '../util/pool'
import {fork} from '../util/fork'
import Environment from './environment'
import {File, Mode} from './file'

export default class Process extends EventEmitter {
  parent: Process = null
  id: number = this.processes.add(this)

  @fork private files = new IDMap<File>()
  @fork private processes = new IDMap<Process>()
  @fork private input = new Environment()
  @fork private output = new Environment()
  private zone = new Zone()

  constructor () {
    super()
    this.files.add(new File(this.input, Mode.Read)) // Standard input
    this.files.add(new File(this.output, Mode.Write)) // Standard output
  }

  exit (code: number) {
    if (code) {
      this.input.emit('error')
    }
    this.emit('exit', code)

    // Release any references to functions owned by the process
    this.files.forEach((file) => file.stream.removeAllListeners())
  }

  fork (): Process {
    let copy = fork(this)
    copy.id = this.processes.add(copy)
    copy.parent = this
    copy.zone = this.zone.fork()
    return copy
  }
}