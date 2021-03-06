import { join } from 'path'
import { createTempDirectory } from '.'
import * as scrape from 'website-scraper'

interface Result {
  location: string
  cleanup(): void
}

export default async function scrapeToDir(
  url: string,
  extraAllowedUrls: string[] = [],
): Promise<Result> {
  const { directory, cleanup } = await createTempDirectory()

  const location = join(directory, 'scrape')
  const urlOrigin = new URL(url).origin

  const options = {
    urls: [url],
    directory: location,
    recursive: true,
    requestConcurrency: 5,
    urlFilter: (u: string) => {
      // filter out external sites except for extraAllowedUrls
      if (u.indexOf(urlOrigin) === 0) {
        return true
      }
      for (const extraAllowedUrl of extraAllowedUrls) {
        if (u.indexOf(extraAllowedUrl) === 0) {
          return true
        }
      }
      return false
    },
  }
  await scrape(options)

  return { location, cleanup }
}
