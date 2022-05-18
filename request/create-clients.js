const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const generateTF = require('./generate-tf');

const realms = ['onestopauth', 'onestopauth-basic', 'onestopauth-both', 'onestopauth-business'];
const allEnvironments = ['dev', 'test', 'prod'];

module.exports = ({
  clientId,
  realmName,
  publicAccess,
  devValidRedirectUris,
  testValidRedirectUris,
  prodValidRedirectUris,
  environments,
  bceidApproved,
  archived,
  browserFlowOverride,
  tfModuleRef,
}) => {
  if (!realms.includes(realmName)) return null;

  const getEnvPath = (env) => {
    const outputDir = path.join(`terraform/keycloak-${env}/realms/${realmName}`);
    const tfFile = `client-${clientId}.tf`;
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

    if (env === 'prod') {
      validRedirectUris = prodValidRedirectUris;
    } else if (env === 'test') {
      validRedirectUris = testValidRedirectUris;
    } else {
      validRedirectUris = devValidRedirectUris;
    }

    const result = generateTF({
      clientId,
      validRedirectUris,
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
