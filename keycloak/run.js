const KcAdminClient = require('keycloak-admin').default;

module.exports = async function run({ context, args }) {
  const getKcAdminClient = async (env) => {
    const kcAdminClient = new KcAdminClient({
      baseUrl: args[`${env}KeycloakUrl`],
      realmName: 'master',
      requestConfig: {
        /* Axios request config options https://github.com/axios/axios#request-config */
        timeout: 60000,
      },
    });

    await kcAdminClient.auth({
      grantType: 'client_credentials',
      clientId: args[`${env}ClientId`],
      clientSecret: args[`${env}ClientSecret`],
    });

    return kcAdminClient;
  };

  const updateReviewProfileConfig = async (env) => {
    const kcAdminClient = await getKcAdminClient(env);
    const realms = await kcAdminClient.realms.find();

    for (let x = 0; x < realms.length; x++) {
      const realm = realms[x].realm;

      const execs = await kcAdminClient.authenticationManagement.getExecutions({
        realm,
        flow: 'first broker login',
      });
      const reviewProfileExe = execs.find((exe) => exe.alias === 'review profile config');
      await kcAdminClient.authenticationManagement.updateExecution(
        { realm, flow: 'first broker login' },
        {
          ...reviewProfileExe,
          requirement: 'DISABLED',
        },
      );
    }
  };

  try {
    await Promise.all(['dev', 'test', 'prod'].map(updateReviewProfileConfig));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
