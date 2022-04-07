const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const generateGoldTF = require('./generate-gold-tf');

const allEnvironments = ['dev', 'test', 'prod'];

module.exports = ({
  clientName,
  publicAccess,
  devValidRedirectUris,
  testValidRedirectUris,
  prodValidRedirectUris,
  environments,
  bceidApproved,
  archived,
  browserFlowOverride,
  serviceType,
  devIdps,
  testIdps,
  prodIdps,
  devRoles,
  testRoles,
  prodRoles,
  tfModuleRef,
}) => {
  const getEnvPath = (env) => {
    const outputDir = path.join(`terraform-v2/keycloak-${env}/standard-clients`);
    const tfFile = `${clientName}.tf`;
    const target = path.join(outputDir, tfFile);

    return {
      outputDir,
      tfFile,
      target,
    };
  };

  const paths = _.map(environments, (env) => {
    const { outputDir, target } = getEnvPath(env);
    let validRedirectUris = [];
    let roles = [];
    let idps = [];

    if (env === 'prod') {
      validRedirectUris = prodValidRedirectUris;
      roles = prodRoles;
      idps = prodIdps;
    } else if (env === 'test') {
      validRedirectUris = testValidRedirectUris;
      roles = testRoles;
      idps = testIdps;
    } else {
      validRedirectUris = devValidRedirectUris;
      roles = devRoles;
      idps = devIdps;
    }

    // need to create default scopes here based on their idp selection
    const result = generateGoldTF({
      clientName,
      validRedirectUris,
      roles,
      idps,
      publicAccess,
      browserFlowOverride,
      tfModuleRef,
    });

    shell.mkdir('-p', outputDir);
    fs.writeFileSync(target, result);

    child_process.execSync('terraform fmt', { cwd: outputDir });

    return target;
  });

  return { paths, allPaths: allEnvironments.map((env) => getEnvPath(env).target) };
};
