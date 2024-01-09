import { Octokit } from '@octokit/rest';
import * as core from '@actions/core';
import * as actions from '@actions/github';

const context = actions.context;

async function main() {
  try {
    const TOKEN_KEY = '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';
    const octokit = new Octokit({ TOKEN_KEY });

    const allPullRequests = await octokit.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'closed',
    });

    // Print the PR numbers here, after the data is retrieved
    for (const pr of allPullRequests.data) {
      console.log(`Processing PR #${pr.number}`);
    }

    const filteredComments = [];
    const mergedPrComments = [];

    for (const pr of allPullRequests.data) {
      try {
        const issueComments = await octokit.issues.listComments({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: pr.number,
        });

        const commentsWithTested = issueComments.data.filter(
          (comment) => comment.body.toUpperCase().includes('TESTED')
        );

        const prReviewComments = await Promise.all(
          commentsWithTested.map(async (comment) => {
            try {
              const reviewComment = await octokit.pulls.getReviewComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                pull_number: pr.number,
                comment_id: comment.id,
              });
              return reviewComment.data;
            } catch (error) {
              console.error('Error fetching review comment:', error.message);
              return null;
            }
          })
        );

        filteredComments.push(...commentsWithTested);
        mergedPrComments.push(...prReviewComments.filter((comment) => comment !== null));
      } catch (error) {
        console.error('Error processing pull request:', error.message);
      }
    }

    core.setOutput('filtered_comments', filteredComments);
    core.setOutput('merged_pr_comments', mergedPrComments);
  } catch (error) {
    console.error('Error:', error.message);
    core.setFailed(error.message);
  }
}

main();
