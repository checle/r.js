#!/usr/bin/node

import 'boot'
import * as http from 'http'
import * as path from 'path'
import * as url from 'url'
import {fclose, fopen, File} from 'stdio'
import {opendir, readdir, closedir, Dir, Dirent} from 'dirent'
import {stat} from 'unistd'
import {Stat, S} from 'sys/stat'
import {IncomingMessage, ServerResponse} from 'http'

const ROOT = path.resolve(__dirname, '..')

async function request (req: IncomingMessage, res: ServerResponse) {
  const uri = url.parse(req.url).pathname
  const filename = path.join(ROOT, uri)

  res.setHeader('Content-Type', 'text/plain')

  const status: Stat = await stat(filename)

  if (status.mode & S.IFDIR) {
    const dir: Dir = await opendir(filename)
    for (let dirent of dir) {
      res.write(dirent.name + '\0')
    }
    closedir(dir)
  } else {
    const file = await fopen(filename) as File
    await file.pipeTo(res)
    file.close()
  }

  switch (req.method) {
    case 'GET':
  }
}

export default function main (port) {
  port = Number(port) || 80

  http.createServer(request).listen(port)
}
