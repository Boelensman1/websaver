import { WebSaver } from '../src/'
import { createTempDirectory } from '../src/'
import { stat } from 'fs-extra'
import { join } from 'path'

jest.setTimeout(300000)

const zpaqLocation = process.env.zpaq || 'zpaq'

it('saves a website', async () => {
  const { directory, cleanup } = await createTempDirectory()
  const webSaver = new WebSaver(directory, zpaqLocation)
  await webSaver.crawl(
    'https://www.random.org/integers/?num=1&min=1&max=6000&col=1&base=10&format=plain&rnd=new',
    'random',
  )
  const directoryStat = await stat(join(directory, 'random'))
  expect(directoryStat.isDirectory()).toBe(true)

  const zpaqStat = await stat(join(directory, 'random', 'arc0000001.zpaq'))
  expect(zpaqStat.isFile()).toBe(true)
  expect(zpaqStat.size).toBeGreaterThan(1)

  // tslint:disable-next-line non-literal-require
  const log = require(join(directory, 'random', 'log.json'))
  expect(Object.keys(log)).toHaveLength(1)
  expect(Object.values(log)).toEqual(['arc0000001.zpaq'])
  await cleanup()
})
