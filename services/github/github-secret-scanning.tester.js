import { createServiceTester } from '../tester.js'
export const t = await createServiceTester()

t.create('Secret Scanning with no alerts')
  .get('/badges/shields.json')
  .intercept(nock =>
    nock('https://api.github.com')
      .get('/repos/badges/shields/secret-scanning/alerts?state=open')
      .reply(200, []),
  )
  .expectBadge({
    label: 'secret scanning',
    message: 'passing',
    color: 'brightgreen',
  })

t.create('Secret Scanning disabled or no permission')
  .get('/badges/shields.json')
  .intercept(nock =>
    nock('https://api.github.com')
      .get('/repos/badges/shields/secret-scanning/alerts?state=open')
      .reply(404),
  )
  .expectBadge({
    label: 'secret scanning',
    message: 'not enabled',
    color: 'red',
  })

t.create('Secret Scanning with alerts')
  .get('/badges/shields.json')
  .intercept(nock =>
    nock('https://api.github.com')
      .get('/repos/badges/shields/secret-scanning/alerts?state=open')
      .reply(200, [{ id: 1 }]),
  )
  .expectBadge({
    label: 'secret scanning',
    message: 'failing',
    color: 'red',
  })
