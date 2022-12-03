const _ = require('lodash');

const buildPullRequestBody = (integration) => {
  const {
    apiServiceAccount,
    authType,
    clientId,
    realm: realmName,
    environments,
    accountableEntity,
    requester,
    idpNames,
    devValidRedirectUris,
    testValidRedirectUris,
    prodValidRedirectUris,
  } = integration;

  let body = apiServiceAccount
    ? ``
    : `
  #### Project Name: \`${_.startCase(clientId)}\``;

  body = body.concat(`
  #### Target Realm: \`${realmName}\`
  #### Environments: \`${environments.join(', ')}\`
  `);

  if (authType !== 'service-account' && !apiServiceAccount) {
    body = body.concat(
      `#### Accountable person(s): \`${accountableEntity}\`
  #### Submitted by: \`${requester}\`
  #### Identity providers: \`${idpNames.join(', ')}\`
  ${environments.map(
    (env) => `<details>
    <summary>Show Details for ${env}</summary>
    \`\`\`<ul>✔️Valid Redirect Urls${(env === 'dev'
      ? devValidRedirectUris || []
      : env === 'test'
      ? testValidRedirectUris || []
      : prodValidRedirectUris || []
    ).map((url) => `<li>${url}</li>`)}</ul>\`\`\`
    </details>`,
  )}`,
    );
  }

  return body;
};

module.exports = {
  buildPullRequestBody,
};
