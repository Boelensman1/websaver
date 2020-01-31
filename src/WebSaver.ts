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

  async crawl(url: string, outLocation?: string): Promise<void> {
    if (!outLocation) {
      outLocation = this.getOutLocation(url)
    } else {
      outLocation = join(this.baseDirectory, outLocation)
    }
    const log = new Log(outLocation)
    await log.read()

    const { cleanup, location } = await scrapeToDir(url)

    const { out } = await run(
      this.zpaq,
      ['a', `${resolve(join(outLocation, 'arc???????'))}`, './'],
      location,
    )

    let file
    try {
      file = /^Creating .*(arc\d{7}\.zpaq) at offset/m.exec(out)[1]
    } catch (err) {
      console.log(out)
      await cleanup()
      throw new Error('Error while reading zpaq output.')
    }
    log.addEntry(file)
    log.write()

    await cleanup()
  }

  async list(url: string): Promise<LogEntries> {
    const outLocation = this.getOutLocation(url)
    const log = await new Log(outLocation)
    return log.contents
  }
}
