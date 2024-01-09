import Octokit from '@octokit/rest';
import core from '@actions/core';

// Import the entire module and access 'github' property later:
import pkg from '@actions/github';

async function main() {
  try {
    const TOKEN_KEY = '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';
    const octokit = new Octokit(TOKEN_KEY);

    // **Replace this section with your specific actions:**

    // Example: Fetching closed pull requests and filtering comments
    const allPullRequests = await octokit.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'closed',
    });

    const filteredComments = [];
    const mergedPrComments = [];

    for (const pr of allPullRequests.data) {
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
          return await octokit.pulls.getReviewComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: pr.number,
            comment_id: comment.id,
          });
        })
      );

      filteredComments.push(...commentsWithTested);
      mergedPrComments.push(...prReviewComments.map((comment) => comment.data));
    }

    core.setOutput('filtered_comments', filteredComments);
    core.setOutput('merged_pr_comments', mergedPrComments);

    // **End of example actions**

  } catch (error) {
    console.log('Error:', error.message);
    core.setFailed(error.message);
  }
}

main();
