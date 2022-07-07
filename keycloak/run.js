const KcAdminClient = require('keycloak-admin').default;

module.exports = async function run({ context, args }) {
  const tasks = (args.tasks || '').split(' ');

  const getKcAdminClient = async (env) => {
    const kcAdminClient = new KcAdminClient({
      baseUrl: args[`${env}KeycloakUrl`] + '/auth',
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

  const enforceBrowserConditionalOtp = async (env) => {
    const kcAdminClient = await getKcAdminClient(env);

    const realm = 'master';
    const search = { realm, flow: 'browser' };
    const execs = await kcAdminClient.authenticationManagement.getExecutions(search);

    const otpExe = execs.find((exe) => exe.displayName === 'Browser - Conditional OTP');
    await kcAdminClient.authenticationManagement.updateExecution(search, {
      ...otpExe,
      requirement: 'REQUIRED',
    });
  };

  try {
    const taskMap = {
      'update-review-profile-config': () => Promise.all(['dev', 'test', 'prod'].map(updateReviewProfileConfig)),
      'enforce-browser-conditional-otp': () => Promise.all(['prod'].map(enforceBrowserConditionalOtp)),
    };

    for (let x = 0; x < tasks.length; x++) {
      const task = taskMap(tasks[x]);
      if (!task) return;

      await task();
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
