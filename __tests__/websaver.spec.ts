import { WebSaver } from '../src/'

jest.setTimeout(300000)

it('saves a website', async () => {
  const webSaver = new WebSaver()
  await webSaver.crawl(
    'https://www.random.org/integers/?num=1&min=1&max=6000&col=1&base=10&format=plain&rnd=new',
  )
})
