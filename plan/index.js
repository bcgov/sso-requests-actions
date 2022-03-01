const core = require('@actions/core');
const { context, getOctokit } = require('@actions/github');
const run = require('./run');

process.on('unhandledRejection', handleError);
main().catch(handleError);

async function main() {
  const token = core.getInput('github-token', { required: true });
  const apiUrl = core.getInput('api-url', { required: true });
  const authSecret = core.getInput('auth-secret', { required: true });
  const planOutput = core.getInput('plan-output', { required: true });
  const planResult = core.getInput('plan-result', { required: true });
  const prNumber = core.getInput('pr-number', { required: true });
  const prBranch = core.getInput('pr-branch', { required: true });
  const allowedAdditions = core.getInput('allowed-additions', { required: false });
  const allowedDeletions = core.getInput('allowed-deletions', { required: false });
  const allowedUpdates = core.getInput('allowed-updates', { required: false });
  const allowedFileChanges = core.getInput('allowed-file-changes', { required: false });
  const allowedFileAdditions = core.getInput('allowed-file-additions', { required: false });
  const allowedFileDeletions = core.getInput('allowed-file-deletions', { required: false });

  const github = getOctokit(token);

  const result = await run({
    github: github.rest,
    context,
    args: {
      apiUrl,
      authSecret,
      planOutput,
      planResult,
      prNumber,
      prBranch,
      allowedAdditions,
      allowedDeletions,
      allowedUpdates,
      allowedFileChanges,
      allowedFileAdditions,
      allowedFileDeletions,
    },
  });
  core.setOutput('result', JSON.stringify(result));
}

function handleError(err) {
  console.error(err);
  core.setFailed(`Unhandled error: ${err}`);
}
