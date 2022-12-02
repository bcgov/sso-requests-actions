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

  let body = `
  #### Project Name: \`${_.startCase(clientId)}\`
  #### Target Realm: \`${realmName}\`
  #### Environments: \`${environments.join(', ')}\`
  `;

  if (authType === 'browser-login' && !apiServiceAccount) {
    body = body.concat(`#### Accountable person(s): \`${accountableEntity}\`
  #### Submitted by: \`${requester}\``);
  }

  if (!apiServiceAccount) {
    body = body.concat(`
  #### Identity providers: \`${idpNames.join(', ')}\`
  `);
  }

  body = body.concat(
    `${environments.map(
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

  return body;
};

module.exports = {
  buildPullRequestBody,
};
