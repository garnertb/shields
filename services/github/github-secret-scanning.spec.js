import { test, given } from 'sazerac'
import GithubSecretScanning from './github-secret-scanning.service.js'

describe('GitHubSecretScanning', function () {
  test(GithubSecretScanning.transform, () => {
    given({ data: [] }).expect({ count: 0 })
    given({ data: [{ id: 1 }] }).expect({ count: 1 })
  })
})
