const fs = require('fs');
const axios = require('axios');
const _ = require('lodash');
const createClients = require('./create-clients');

module.exports = async function run({ github, context, args }) {
  const { apiUrl, authSecret, tfModuleRef } = args;
  const { payload } = context;
  const { inputs, repository } = payload;
  const owner = repository.owner.login;
  const repo = repository.name;

  let { requestId, clientName, realmName, validRedirectUris, environments, publicAccess, browserFlowOverride } = inputs;

  const axiosConfig = { headers: { Authorization: authSecret } };

  try {
    console.log(requestId, clientName, realmName, validRedirectUris, environments, publicAccess, browserFlowOverride);

    validRedirectUris = JSON.parse(validRedirectUris);
    environments = JSON.parse(environments);

    const info = createClients({
      clientName,
      realmName,
      validRedirectUris,
      environments,
      publicAccess,
      browserFlowOverride,
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

    const prBranchName = `request/${clientName}-${new Date().getTime()}`;

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
          message: `chore: remove a client file for ${clientName}`,
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
        message: `feat: add a client file for ${clientName}`,
        content: fs.readFileSync(path, { encoding: 'base64' }),
      });
    }

    // Ensure to verify label length < 50 chars if adding client names to labels
    const labels = ['auto_generated', 'request', String(requestId)];

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
    let pr = await github.pulls.create({
      owner,
      repo,
      base: repository.default_branch,
      head: prBranchName,
      title: `request: ${mode} client files for ${clientName}`,
      body: `
  #### Project Name: \`${_.startCase(clientName)}\`
  #### Target Realm: \`${realmName}\`
  #### Environments: \`${environments.join(', ')}\`
  ${environments.map(
    (env) => `<details><summary>Show Details for ${env}</summary>
  \`\`\`<ul>✔️Valid Redirect Urls${(validRedirectUris[env] || validRedirectUris || []).map(
    (url) => `<li>${url}</li>`,
  )}</ul>\`\`\`
  </details>`,
  )}`,
      maintainer_can_modify: false,
    });

    const {
      data: { number },
    } = pr;

    await github.issues.addLabels({
      owner,
      repo,
      issue_number: number,
      labels,
    });

    const updateStatus = () =>
      axios.put(
        apiUrl,
        {
          prNumber: number,
          prSuccess: true,
          id: requestId,
          actionNumber: context.runId,
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
    console.log(err);
    axios.put(
      apiUrl,
      {
        prNumber: null,
        prSuccess: false,
        id: requestId,
        actionNumber: context.runId,
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
