const _ = require('lodash');

const buildPullRequestBody = (integration) => {
  const {
    apiServiceAccount,
    authType,
    clientId,
    realm,
    environments = [],
    accountableEntity,
    requester,
    idpNames = [],
    devValidRedirectUris,
    testValidRedirectUris,
    prodValidRedirectUris,
    projectName,
  } = integration;

  const defaultRealm = 'standard';

  let body = `#### Project Name: \`${projectName}\`
  #### Client Id: \`${clientId}\`
  #### Target Realm: \`${realm || defaultRealm}\`
  #### Submitted by: \`${requester}\`
  #### Accountable Person/Team: \`${accountableEntity}\`
  `;

  if (!apiServiceAccount) {
    body = body.concat(`#### Environments: \`${environments.join(', ')}\``);
  }

  if (['browser-login', 'both'].includes(authType) && !apiServiceAccount) {
    body = body.concat(
      `
  #### Identity providers: \`${idpNames.join(', ')}\`
  ${environments
    .map(
      (env) => `
<details>
  <summary>Show Details for ${env}</summary>
  <ul>✔️ Valid Redirect Urls${(env === 'dev'
    ? devValidRedirectUris || []
    : env === 'test'
    ? testValidRedirectUris || []
    : prodValidRedirectUris || []
  )
    .map((url) => `<li>${url}</li>`)
    .join('')}
  </ul>
</details>`,
    )
    .join('')}`,
    );
  }

  return body;
};

const generateClientId = (id, projectName) => {
  return `${_.kebabCase(projectName)}-${id}`
}

module.exports = {
  buildPullRequestBody,
  generateClientId
};
