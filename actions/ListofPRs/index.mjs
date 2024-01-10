import { Octokit } from '@octokit/rest';
import * as core from '@actions/core';
import * as actions from '@actions/github';

const context = actions.context;

async function main() {
  try {
    const TOKEN_KEY = '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';
    const octokit = new Octokit({ TOKEN_KEY });

    const prNumber = process.argv[2];
    console.log(`Processing PR number: ${prNumber}`);

    const filteredPRNumbers = [];

    const allPullRequests = await octokit.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'closed',
    });

    for (const pr of allPullRequests.data) {
      try {
        const exactPRNumber = pr.node_id.split('/').pop();

        const allCommentsForPR = await octokit.issues.listComments({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: pr.number,
        });

        for (const comment of allCommentsForPR.data) {
          if (comment.body.trim() === 'TESTED') {
            filteredPRNumbers.push(pr.number);
            break; // Move to the next PR once a "TESTED" comment is found
          }
        }
      } catch (error) {
        console.error('Error processing pull request:', error.message);
      }
    }

    core.setOutput('filtered_pr_numbers', filteredPRNumbers);
  } catch (error) {
    console.error('Error:', error.message);
    core.setFailed(error.message);
  }
}

main();
