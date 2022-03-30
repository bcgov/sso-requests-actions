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
    let idps = [];

    if (env === 'prod') {
      validRedirectUris = prodValidRedirectUris;
      idps = prodIdps;
    } else if (env === 'test') {
      validRedirectUris = testValidRedirectUris;
      idps = testIdps;
    } else {
      validRedirectUris = devValidRedirectUris;
      idps = devIdps;
    }

    // need to create default scopes here based on their idp selection

    const result = generateGoldTF({
      clientName,
      validRedirectUris,
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
