const _ = require('lodash');
const { TerraformGenerator } = require('terraform-generator');

const mock = new TerraformGenerator();

const keycloakRealm = mock.data('keycloak_realm', 'this', {});
const SEPARATOR = '\n';

module.exports = ({ clientId, validRedirectUris, publicAccess, browserFlowOverride, tfModuleRef }) => {
  const tfg = new TerraformGenerator();

  const data = {
    source: `github.com/bcgov/sso-terraform-keycloak-client?ref=${tfModuleRef}`,
    realm_id: keycloakRealm.attr('id'),
    client_id: clientId,
    client_name: clientId,
    valid_redirect_uris: validRedirectUris,
    description: 'CSS App Created',
  };

  // The GH action converts the null value into a string
  if (browserFlowOverride) {
    const flow = _.snakeCase(`${clientId}-browserflow`);
    tfg.data('keycloak_authentication_flow', flow, {
      realm_id: keycloakRealm.attr('id'),
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

  tfg.module(`client_${clientId}`, data);

  const result = tfg.generate();

  const formatted =
    result.tf
      .split(SEPARATOR)
      .filter((v) => v.length > 0)
      .join(SEPARATOR) + SEPARATOR;

  return formatted;
};
