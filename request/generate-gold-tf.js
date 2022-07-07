const _ = require('lodash');
const { TerraformGenerator } = require('terraform-generator');

const mock = new TerraformGenerator();

const realm_id = mock.variable('standard_realm_id');
const SEPARATOR = '\n';

module.exports = ({
  clientId,
  clientName,
  validRedirectUris,
  roles,
  idps,
  accessTokenLifespan,
  sessionIdleTimeout,
  sessionMaxLifespan,
  offlineSessionIdleTimeout,
  offlineSessionMaxLifespan,
  publicAccess,
  authType,
  browserFlowOverride,
  tfModuleRef,
}) => {
  const tfg = new TerraformGenerator();

  const data = {
    source: `github.com/bcgov/sso-terraform-modules?ref=${tfModuleRef}/modules/standard-client`,
    realm_id,
    client_id: clientId,
    client_name: clientName,
    valid_redirect_uris: validRedirectUris,
    roles,
    access_token_lifespan: accessTokenLifespan,
    client_session_idle_timeout: sessionIdleTimeout,
    client_session_max_lifespan: sessionMaxLifespan,
    client_offline_session_idle_timeout: offlineSessionIdleTimeout,
    client_offline_session_max_lifespan: offlineSessionMaxLifespan,
    idps: idps.concat('common'),
    description: 'CSS App Created',
  };

  // The GH action converts the null value into a string
  if (browserFlowOverride) {
    const flow = _.snakeCase(`${clientId}-browserflow`);
    tfg.data('keycloak_authentication_flow', flow, {
      realm_id,
      alias: browserFlowOverride,
    });

    data.override_authentication_flow = true;
    data.browser_authentication_flow = mock.data('keycloak_authentication_flow', flow, {}).id;
  }

  if (publicAccess) {
    data.access_type = 'PUBLIC';
    data.pkce_code_challenge_method = 'S256';
    data.web_origins = validRedirectUris.concat('+');
  }

  data.standard_flow_enabled = ['browser-login', 'both'].includes(authType);
  data.service_accounts_enabled = ['service-account', 'both'].includes(authType);

  tfg.module(clientId, data);

  const result = tfg.generate();

  const formatted =
    result.tf
      .split(SEPARATOR)
      .filter((v) => v.length > 0)
      .join(SEPARATOR) + SEPARATOR;

  return formatted;
};
