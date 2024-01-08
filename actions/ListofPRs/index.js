// Import necessary modules
const core = require('@actions/core');
const { github, context } = require('@actions/github');

async function main() {
  try {
    const octokit = github.getOctokit(process.env.TOKEN_KEY);

    // Get a list of all closed pull requests
    const allPullRequests = await octokit.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'closed',
    });

    const allFilteredComments = [];
    const allMergedPrComments = [];

    // Iterate through each PR and check comments
    for (const pr of allPullRequests.data) {
      const issueComments = await octokit.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: pr.number,
      });

      const filteredComments = issueComments.data.filter((comment) => {
        return comment.body.toUpperCase().includes('TESTED') && comment.pull_request_review_id;
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

    // Set outputs using core
    core.setOutput('filtered_comments', allFilteredComments);
    core.setOutput('merged_pr_comments', allMergedPrComments);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
