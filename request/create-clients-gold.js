const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const _ = require('lodash');
const generateGoldTF = require('./generate-gold-tf');
const generateServiceAccountGoldTF = require('./generate-service-account-gold-tf');

const allEnvironments = ['dev', 'test', 'prod'];

const writeTF = ({ outputDir, target, result }) => {
  shell.mkdir('-p', outputDir);
  fs.writeFileSync(target, result);

  child_process.execSync('terraform fmt', { cwd: outputDir });

  return target;
};

module.exports = (props) => {
  const {
    clientId,
    publicAccess,
    authType,
    environments,
    bceidApproved,
    archived,
    browserFlowOverride,
    teamId,
    apiServiceAccount,
    tfModuleRef,
  } = props;

  const getEnvPath = (env, subdir = 'standard-clients') => {
    const outputDir = `terraform-v2/keycloak-${env}/${subdir}`;
    shell.mkdir('-p', outputDir);
    const tfFile = `${clientId}.tf`;
    const target = path.join(outputDir, tfFile);

    return {
      outputDir,
      tfFile,
      target,
    };
  };

  if (apiServiceAccount) {
    const result = generateServiceAccountGoldTF({
      clientId,
      teamId,
      tfModuleRef,
    });

    const { outputDir, target } = getEnvPath('prod', 'standard-service-accounts');
    const paths = [writeTF({ outputDir, target, result })];
    return { paths, allPaths: paths };
  }

  const paths = _.map(environments, (env) => {
    const { outputDir, target } = getEnvPath(env);
    const validRedirectUris = props[`${env}ValidRedirectUris`] || [];
    const roles = props[`${env}Roles`] || [];
    const clientName = props[`${env}LoginTitle`] || '';
    const idps = props[`${env}Idps`] || [];
    const accessTokenLifespan = props[`${env}AccessTokenLifespan`] || '';
    const sessionIdleTimeout = props[`${env}SessionIdleTimeout`] || '';
    const sessionMaxLifespan = props[`${env}SessionMaxLifespan`] || '';
    const offlineSessionIdleTimeout = props[`${env}OfflineSessionIdleTimeout`] || '';
    const offlineSessionMaxLifespan = props[`${env}OfflineSessionMaxLifespan`] || '';

    // need to create default scopes here based on their idp selection
    const result = generateGoldTF({
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
    });

    return writeTF({ outputDir, target, result });
  });

  return { paths, allPaths: allEnvironments.map((env) => getEnvPath(env).target) };
};
