const _ = require('lodash');
const { TerraformGenerator } = require('terraform-generator');

const mock = new TerraformGenerator();

const realm_id = mock.variable('standard_realm_id');
const SEPARATOR = '\n';

module.exports = ({ clientId, teamId, tfModuleRef, webOrigins }) => {
  const tfg = new TerraformGenerator();

  const data = {
    source: `github.com/bcgov/sso-terraform?ref=${tfModuleRef}/terraform-modules/modules/standard-service-account`,
    realm_id,
    client_id: clientId,
    team_id: teamId,
    description: 'CSS App Created',
    web_origins: webOrigins,
  };

  tfg.module(clientId, data);

  const result = tfg.generate();

  const formatted =
    result.tf
      .split(SEPARATOR)
      .filter((v) => v.length > 0)
      .join(SEPARATOR) + SEPARATOR;

  return formatted;
};
