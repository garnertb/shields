import Joi from 'joi'
import { renderBuildStatusBadge } from '../build-status.js'
import { GithubAuthV3Service } from './github-auth-service.js'
import { httpErrorsFor, documentation } from './github-helpers.js'

const schema = Joi.array()

export default class GithubSecretScanning extends GithubAuthV3Service {
  static category = 'analysis'
  static route = { base: 'github/secret-scanning', pattern: ':user/:repo' }
  static examples = [
    {
      title: 'GitHub secret scanning',
      namedParams: { user: 'badges', repo: 'shields' },
      staticPreview: {
        label: 'secret scanning',
        message: 'passing',
        color: 'brightgreen',
      },
      documentation,
    },
  ]

  static defaultBadgeData = {
    label: 'secret scanning',
  }

  static render({ count, link }) {
    const badgeStatus = renderBuildStatusBadge({
      label: 'secret scanning',
      status: count > 0 ? 'failing' : 'passing',
    })
    return {
      ...badgeStatus,
      link,
    }
  }

  // override the constructor so we can access the GitHub instance URL
  constructor(context, config) {
    super(context, config)
    this.gitHubWebUrl = context.githubApiProvider.baseUrl.replace(
      'https://api.github',
      'https://github',
    )
  }

  async fetch({ user, repo }) {
    const commonAttrs = {
      httpErrors: httpErrorsFor('not enabled'),
    }

    return this._requestJson({
      schema,
      url: `/repos/${user}/${repo}/secret-scanning/alerts?state=open`,
      ...commonAttrs,
    })
  }

  static transform({ data }) {
    return {
      count: data.length,
    }
  }

  async handle({ user, repo }) {
    const json = await this.fetch({ user, repo })
    const { count } = this.transform({ data: json })
    return this.constructor.render({
      count,
      link: `${this.gitHubWebUrl}/${user}/${repo}/security/secret-scanning?query=is%3Aopen`,
    })
  }
}
