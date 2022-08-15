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
  assertionLifespan,
  browserFlowOverride,
  tfModuleRef,
}) => {
  const tfg = new TerraformGenerator();

  assertion_lifespan = '120';

  override_authentication_flow = true;
  browser_authentication_flow = data.keycloak_authentication_flow.saml_test_browserflow.id;

  const data = {
    source: `github.com/bcgov/sso-terraform-modules?ref=${tfModuleRef}/modules/standard-client-saml`,
    realm_id,
    client_id: clientId,
    client_name: clientName,
    roles,
    assertion_lifespan: assertionLifespan,
    valid_redirect_uris: validRedirectUris,
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

  tfg.module(clientId, data);

  const result = tfg.generate();

  const formatted =
    result.tf
      .split(SEPARATOR)
      .filter((v) => v.length > 0)
      .join(SEPARATOR) + SEPARATOR;

  return formatted;
};
