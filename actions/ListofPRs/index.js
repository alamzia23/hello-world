const { github, context } = require('@actions/github');

try {
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

  const { data: issueComments } = await octokit.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
  });

  // Filter comments for "TESTED" and only those associated with merged PRs
  const filteredComments = issueComments.filter((comment) => {
    return comment.body.toUpperCase().includes('TESTED') && comment.pull_request_review_id;
  });

  // Retrieve comments specifically from the merged PR
  const mergedPrComments = await Promise.all(
    filteredComments.map(async (comment) => {
      const { data: prReviewComment } = await octokit.pulls.getReviewComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: context.issue.number,
        comment_id: comment.id,
      });
      return prReviewComment;
    })
  );

  core.setOutput('filtered_comments', filteredComments);
  core.setOutput('merged_pr_comments', mergedPrComments);
} catch (error) {
  core.setFailed(error.message);
}
