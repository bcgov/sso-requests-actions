const _ = require('lodash');
const { TerraformGenerator } = require('terraform-generator');

const mock = new TerraformGenerator();

const keycloakRealm = mock.data('keycloak_realm', 'this', {});
const SEPARATOR = '\n';

module.exports = ({ clientName, validRedirectUris, publicAccess, browserFlowOverride, tfModuleRef }) => {
  const tfg = new TerraformGenerator();

  const data = {
    source: `github.com/bcgov/sso-terraform-keycloak-client?ref=${tfModuleRef}`,
    realm_id: keycloakRealm.attr('id'),
    client_name: clientName,
    valid_redirect_uris: validRedirectUris,
    description: 'CSS App Created',
  };

  console.log(`browserFlowOverride: ${browserFlowOverride}, type: ${typeof browserFlowOverride}`)

  if (browserFlowOverride && browserFlowOverride !== 'null') {
    const flow = _.snakeCase(`${clientName}-browserflow`);
    tfg.data('keycloak_authentication_flow', flow, {
      realm_id: keycloakRealm.attr('id'),
      alias: browserFlowOverride,
    });

    data.override_authentication_flow = true;
    data.browser_authentication_flow = mock.data('keycloak_authentication_flow', flow, {}).id;
  }

  if (publicAccess === 'true') {
    data.access_type = 'PUBLIC';
    data.pkce_code_challenge_method = 'S256';
    data.web_origins = ['+'];
  }

  tfg.module(`client_${clientName}`, data);

  const result = tfg.generate();

  const formatted =
    result.tf
      .split(SEPARATOR)
      .filter((v) => v.length > 0)
      .join(SEPARATOR) + SEPARATOR;

  return formatted;
};
