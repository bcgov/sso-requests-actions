const core = require('@actions/core');
const { context } = require('@actions/github');
const run = require('./run');

process.on('unhandledRejection', handleError);
main().catch(handleError);

async function main() {
  const devKeycloakUrl = core.getInput('dev-keycloak-url', { required: true });
  const testKeycloakUrl = core.getInput('test-keycloak-url', { required: true });
  const prodKeycloakUrl = core.getInput('prod-keycloak-url', { required: true });
  const devClientId = core.getInput('dev-client-id', { required: true });
  const testClientId = core.getInput('test-client-id', { required: true });
  const prodClientId = core.getInput('prod-client-id', { required: true });
  const devClientSecret = core.getInput('dev-client-secret', { required: true });
  const testClientSecret = core.getInput('test-client-secret', { required: true });
  const prodClientSecret = core.getInput('prod-client-secret', { required: true });
  const tasks = core.getInput('tasks', { required: true });

  const result = await run({
    context,
    args: {
      devKeycloakUrl,
      testKeycloakUrl,
      prodKeycloakUrl,
      devClientId,
      testClientId,
      prodClientId,
      devClientSecret,
      testClientSecret,
      prodClientSecret,
      tasks,
    },
  });
  core.setOutput('result', JSON.stringify(result));
}

function handleError(err) {
  console.error(err);
  core.setFailed(`Unhandled error: ${err}`);
}
