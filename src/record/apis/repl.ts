import * as readline from 'readline'
import { createInterface, ReadLine } from 'readline'
import { Writable } from 'stream'
import { RecordStream } from './stream'

export default class REPL {
  record = new RecordStream()
  terminal: ReadLine
  reader: ReadLine

  start (options) {
    var prompt = options
    if (typeof prompt === 'string') options = {}
    else prompt = options.prompt

    this.terminal = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    if (prompt) this.terminal.setPrompt(prompt)

    this.reader = readline.createInterface({
      input: this.record
    })

    this.terminal.on('line', (line) => {
      this.record.write(line)
    })
    this.reader.on('line', (line) => {
      this.terminal.write(line)
    })
  }
}
