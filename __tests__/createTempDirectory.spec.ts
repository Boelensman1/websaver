import { createTempDirectory } from '../src/'
import { stat } from 'fs-extra'

it('Creates a temp directory', async () => {
  const { directory, cleanup } = await createTempDirectory()
  const stats = await stat(directory)

  expect(stats.isDirectory()).toBe(true)
  cleanup()
})
