const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const generateGoldTF = require('./generate-gold-tf');

const allEnvironments = ['dev', 'test', 'prod'];

module.exports = (props) => {
  const {
    clientName,
    publicAccess,
    environments,
    bceidApproved,
    archived,
    browserFlowOverride,
    serviceType,
    tfModuleRef,
  } = props;

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
    const validRedirectUris = props[`${env}ValidRedirectUris`] || [];
    const roles = props[`${env}Roles`] || [];
    const idps = props[`${env}Idps`] || [];
    const accessTokenLifespan = props[`${env}AccessTokenLifespan`] || '';
    const sessionIdleTimeout = props[`${env}SessionIdleTimeout`] || '';
    const sessionMaxLifespan = props[`${env}SessionMaxLifespan`] || '';
    const offlineSessionIdleTimeout = props[`${env}OfflineSessionIdleTimeout`] || '';
    const offlineSessionMaxLifespan = props[`${env}OfflineSessionMaxLifespan`] || '';

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
      accessTokenLifespan,
      sessionIdleTimeout,
      sessionMaxLifespan,
      offlineSessionIdleTimeout,
      offlineSessionMaxLifespan,
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
