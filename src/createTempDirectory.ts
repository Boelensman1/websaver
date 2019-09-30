import * as tmp from 'tmp'

interface Result {
  directory: string
  cleanup(): void
}

export default function createTempDirectory(): Promise<Result> {
  return new Promise(
    (resolve: (res: Result) => void, reject: (err: Error) => void) => {
      tmp.dir((err: Error, directory: string, cleanup: () => void) => {
        if (err) reject(err)

        resolve({
          directory,
          cleanup,
        })
      })
    },
  )
}
