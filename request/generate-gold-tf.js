const _ = require('lodash');
const { TerraformGenerator } = require('terraform-generator');

const mock = new TerraformGenerator();

const realm_id = mock.variable('standard_realm_id');
const SEPARATOR = '\n';

module.exports = ({ clientName, validRedirectUris, roles, idps, publicAccess, browserFlowOverride, tfModuleRef }) => {
  const tfg = new TerraformGenerator();

  const data = {
    source: `github.com/bcgov/sso-terraform-keycloak-client?ref=${tfModuleRef}`,
    realm_id,
    client_name: clientName,
    valid_redirect_uris: validRedirectUris,
    roles,
    idps: idps.concat('common'),
    description: 'CSS App Created',
  };

  // The GH action converts the null value into a string
  if (browserFlowOverride) {
    const flow = _.snakeCase(`${clientName}-browserflow`);
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

  tfg.module(clientName, data);

  const result = tfg.generate();

  const formatted =
    result.tf
      .split(SEPARATOR)
      .filter((v) => v.length > 0)
      .join(SEPARATOR) + SEPARATOR;

  return formatted;
};
