import { join, resolve } from 'path'
import { run, scrapeToDir, Log, LogEntries } from '.'

export default class WebSaver {
  constructor(
    public baseDirectory: string = 'out',
    public zpaq: string = 'zpaq',
  ) {}

  getOutLocation(url: string): string {
    const simpleUrl = url.replace(/^http[s]?:\/\//, '').replace(/\/$/, '')
    return join(this.baseDirectory, encodeURIComponent(simpleUrl))
  }

  async crawl(url: string): Promise<void> {
    const outLocation = this.getOutLocation(url)
    const log = new Log(outLocation)
    await log.read()

    const { cleanup, location } = await scrapeToDir(url)

    const { out } = await run(
      this.zpaq,
      ['a', `${resolve(join(outLocation, 'arc???????'))}`, './'],
      location,
    )
    const file = /^Creating .*(arc\d{7}\.zpaq) at offset/m.exec(out)[1]
    log.addEntry(file)
    log.write()

    cleanup()
  }

  async list(url: string): Promise<LogEntries> {
    const outLocation = this.getOutLocation(url)
    const log = await new Log(outLocation)
    return log.contents
  }
}
