import { join } from 'path'
import { tmpdir } from 'os'
import { mkdtemp, remove } from 'fs-extra'

interface Result {
  directory: string
  cleanup(): void
}

export default async function createTempDirectory(
  prefix: string = 'websaver',
): Promise<Result> {
  const directory = await mkdtemp(join(tmpdir(), `${prefix}-`))
  const cleanup = () => remove(directory)
  return {
    directory,
    cleanup,
  }
}
