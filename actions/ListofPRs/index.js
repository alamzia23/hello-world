const { Octokit } = require('@octokit/rest');
const core = require('@actions/core');
const { github } = require('@actions/github');

async function main() {
  try {
    const TOKEN_KEY = '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';
    const octokit = github.getOctokit(TOKEN_KEY);

    const allFilteredComments = [];
    const allMergedPrComments = [];

    const allPullRequests = await octokit.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'closed',
    });

    for (const pr of allPullRequests.data) {
      const issueComments = await octokit.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: pr.number,
      });

      const filteredComments = issueComments.data.filter((comment) => {
        return comment.body.toUpperCase().includes('TESTED');
      });

      const mergedPrComments = await Promise.all(
        filteredComments.map(async (comment) => {
          const prReviewComment = await octokit.pulls.getReviewComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: pr.number,
            comment_id: comment.id,
          });
          return prReviewComment.data;
        })
      );

      allFilteredComments.push(...filteredComments);
      allMergedPrComments.push(...mergedPrComments);
    }

    core.setOutput('filtered_comments', allFilteredComments);
    core.setOutput('merged_pr_comments', allMergedPrComments);
  } catch (error) {
    console.log('Error:', error.message);
    core.setFailed(error.message);
  }
}

main();
