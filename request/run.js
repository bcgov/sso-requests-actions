const fs = require('fs');
const axios = require('axios');
const _ = require('lodash');
const createClients = require('./create-clients');
const createClientsGold = require('./create-clients-gold');

module.exports = async function run({ github, context, args }) {
  const { apiUrl, authSecret, tfModuleRef } = args;
  const { payload } = context;
  const { inputs, repository } = payload;
  const owner = repository.owner.login;
  const repo = repository.name;

  let { integration } = inputs;
  integration = JSON.parse(integration);

  const {
    id,
    projectName,
    clientId,
    realm: realmName,
    publicAccess,
    environments,
    bceidApproved,
    archived,
    browserFlowOverride,
    serviceType,
    devValidRedirectUris,
    testValidRedirectUris,
    prodValidRedirectUris,
    devIdps,
    testIdps,
    prodIdps,
    devRoles,
    testRoles,
    prodRoles,
    devLoginTitle,
    testLoginTitle,
    prodLoginTitle,
    devAccessTokenLifespan,
    devSessionIdleTimeout,
    devSessionMaxLifespan,
    devOfflineSessionIdleTimeout,
    devOfflineSessionMaxLifespan,
    testAccessTokenLifespan,
    testSessionIdleTimeout,
    testSessionMaxLifespan,
    testOfflineSessionIdleTimeout,
    testOfflineSessionMaxLifespan,
    prodAccessTokenLifespan,
    prodSessionIdleTimeout,
    prodSessionMaxLifespan,
    prodOfflineSessionIdleTimeout,
    prodOfflineSessionMaxLifespan,
  } = integration;

  const axiosConfig = { headers: { Authorization: authSecret } };

  const resData = {
    id,
    actionNumber: context.runId,
    repoOwner: owner,
    repoName: repo,
    prNumber: null,
    success: false,
    changes: {},
    isEmpty: false,
    isAllowedToMerge: false,
  };

  try {
    console.log(integration);

    const info =
      serviceType === 'gold'
        ? createClientsGold({
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
            serviceType,
            devIdps,
            testIdps,
            prodIdps,
            devRoles,
            testRoles,
            prodRoles,
            devLoginTitle,
            testLoginTitle,
            prodLoginTitle,
            devAccessTokenLifespan,
            devSessionIdleTimeout,
            devSessionMaxLifespan,
            devOfflineSessionIdleTimeout,
            devOfflineSessionMaxLifespan,
            testAccessTokenLifespan,
            testSessionIdleTimeout,
            testSessionMaxLifespan,
            testOfflineSessionIdleTimeout,
            testOfflineSessionMaxLifespan,
            prodAccessTokenLifespan,
            prodSessionIdleTimeout,
            prodSessionMaxLifespan,
            prodOfflineSessionIdleTimeout,
            prodOfflineSessionMaxLifespan,
            tfModuleRef,
          })
        : createClients({
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
            serviceType,
            devIdps,
            testIdps,
            prodIdps,
            tfModuleRef,
          });

    if (!info) throw Error('failed in client creation');

    const { paths, allPaths } = info;

    const mainRef = await github.git.getRef({ owner, repo, ref: `heads/${repository.default_branch}` }).then(
      (res) => res.data,
      (err) => null,
    );

    if (!mainRef) {
      console.error('no main branch');
    }

    const prBranchName = `request/${clientId}-${new Date().getTime()}`;

    await github.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${prBranchName}`,
      sha: mainRef.object.sha,
    });

    console.log(allPaths);

    // check the number of existing files to check the mode; create, update and delete
    const allPathSHAs = await Promise.all(allPaths.map((path) => getSHA({ ref: prBranchName, path })));

    console.log(allPathSHAs);

    const existingCount = _.compact(allPathSHAs).length;
    console.log(existingCount);

    let mode;
    if (existingCount === 0) {
      if (paths.length === 0) {
        throw Error('no clients to create');
      }

      mode = 'add';
    } else {
      if (paths.length === 0) {
        mode = 'delete';
      } else {
        mode = 'update';
      }
    }

    console.log('mode', mode);

    // delete the files first before creating ones
    for (let x = 0; x < allPaths.length; x++) {
      const path = allPaths[x];
      await github.repos
        .deleteFile({
          owner,
          repo,
          sha: await getSHA({ ref: prBranchName, path }),
          branch: prBranchName,
          path,
          message: `chore: remove a client file for ${clientId}`,
        })
        .then(
          (res) => res.data,
          (err) => null,
        );
    }

    console.log(paths);

    // create the requested client files
    for (let x = 0; x < paths.length; x++) {
      const path = paths[x];
      await github.repos.createOrUpdateFileContents({
        owner,
        repo,
        sha: await getSHA({ ref: prBranchName, path }),
        branch: prBranchName,
        path,
        message: `feat: add a client file for ${clientId}`,
        content: fs.readFileSync(path, { encoding: 'base64' }),
      });
    }

    // Ensure to verify label length < 50 chars if adding client names to labels
    let labels = ['auto_generated', 'request', String(id)];

    // delete all open issues with the target client before creating another one
    const issuesRes = await github.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      labels: labels.join(','),
    });

    await Promise.all(
      issuesRes.data.map((issue) => {
        return github.issues.update({
          owner,
          repo,
          issue_number: issue.number,
          state: 'closed',
        });
      }),
    );

    // create a new pr for the target client
    // see https://docs.github.com/en/rest/reference/pulls#create-a-pull-request--code-samples
    // see https://octokit.github.io/rest.js/v18#pulls-create
    let pr = await github.pulls.create({
      owner,
      repo,
      base: repository.default_branch,
      head: prBranchName,
      title: `request: ${mode} client files for ${clientId}`,
      body: `
  #### Project Name: \`${_.startCase(clientId)}\`
  #### Target Realm: \`${realmName}\`
  #### Environments: \`${environments.join(', ')}\`
  ${environments.map(
    (env) => `<details><summary>Show Details for ${env}</summary>
  \`\`\`<ul>✔️Valid Redirect Urls${(env === 'dev'
    ? devValidRedirectUris || []
    : env === 'test'
    ? testValidRedirectUris || []
    : prodValidRedirectUris || []
  ).map((url) => `<li>${url}</li>`)}</ul>\`\`\`
  </details>`,
  )}`,
      maintainer_can_modify: false,
    });

    const {
      data: { number, additions, deletions, changed_files },
    } = pr;

    resData.changes = { additions, deletions, changedFiles: changed_files };
    resData.isEmpty = changed_files + additions + deletions === 0;
    resData.isAllowedToMerge = changed_files <= 3 && additions <= 100 && deletions <= 100;

    console.log(`${changed_files} changed files with ${additions} additions and ${deletions} deletions.`);

    if (resData.isEmpty) {
      console.log('found an empty PR');

      labels = labels.concat('empty_pr');

      // see https://octokit.github.io/rest.js/v18#pulls-update
      await github.pulls.update({
        owner,
        repo,
        pull_number: number,
        state: 'closed',
      });
    }

    await github.issues.addLabels({
      owner,
      repo,
      issue_number: number,
      labels,
    });

    const updateStatus = () =>
      axios.put(
        `${apiUrl}/batch/pr`,
        {
          ...resData,
          prNumber: number,
          success: true,
        },
        axiosConfig,
      );

    let success = false;
    for (let x = 0; x < 5; x++) {
      await updateStatus().then(
        () => (success = true),
        () => (success = false),
      );
      if (success) break;
    }

    if (!success) throw Error('failed to update the pr status');

    return pr;
  } catch (err) {
    console.error(err);
    axios.put(
      `${apiUrl}/batch/pr`,
      {
        ...resData,
        prNumber: null,
        success: false,
      },
      axiosConfig,
    );
    throw err;
  }

  async function getSHA({ ref, path }) {
    const data = await github.repos.getContent({ owner, repo, ref, path }).then(
      (res) => res.data,
      (err) => null,
    );

    return data && data.sha;
  }
};
