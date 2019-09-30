import { join } from 'path'
import { mkdir, stat, writeFile, readFile } from 'fs-extra'

export interface LogEntries {
  [key: string]: string
}

export default class Log {
  public path: string
  public contents: LogEntries

  constructor(public directory: string) {
    this.path = join(directory, 'log.json')
  }

  public async read() {
    try {
      await stat(this.directory)
    } catch (e) {
      if (e.code === 'ENOENT') {
        await mkdir(this.directory)
        await writeFile(this.path, JSON.stringify({}))
      } else {
        throw e
      }
    }

    this.contents = JSON.parse(await readFile(this.path))
  }

  public addEntry(file: string) {
    this.contents[Date.now()] = file
  }

  public write() {
    return writeFile(this.path, JSON.stringify(this.contents))
  }
}
