import { Octokit } from '@octokit/rest';
import core from '@actions/core';

// Import the context object:
import * as actions from '@actions/github';
const context = actions.context;

async function main() {
  try {
    const TOKEN_KEY = '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';
    const octokit = new Octokit(TOKEN_KEY);

    // Access repository owner and name using context:
    const allPullRequests = await octokit.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'closed',
    });

    // ... rest of your code (unchanged)

  } catch (error) {
    console.log('Error:', error.message);
    core.setFailed(error.message);
  }
}

main();
