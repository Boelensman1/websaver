import { promisify } from 'util'
import { exec as execCB } from 'child_process'

const exec = promisify(execCB)

interface Result {
  out: string
  error: string
}

export default async function run(
  command: string,
  options: string[],
  cwd: string,
): Promise<Result> {
  const { stdout, stderr } = await exec(`${command} ${options.join(' ')}`, {
    cwd,
  })
  return {
    out: stdout,
    error: stderr,
  }
}
