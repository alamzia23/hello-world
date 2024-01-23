// import { Octokit } from '@octokit/rest';
// import * as core from '@actions/core';
// import * as actions from '@actions/github';

// const context = actions.context;

// async function main() {
//   try {
//     const TOKEN_KEY = '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';
//     const octokit = new Octokit({ TOKEN_KEY });

//     const allPullRequests = await octokit.pulls.list({
//       owner: context.repo.owner,
//       repo: context.repo.repo,
//       state: 'closed',
//     });

//     for (const pr of allPullRequests.data) {
//       try {
//         const allCommentsForPR = await octokit.issues.listComments({
//           owner: context.repo.owner,
//           repo: context.repo.repo,
//           issue_number: pr.number,
//         });

//         let hasTestedComment = false;
//         for (const comment of allCommentsForPR.data) {
//           if (comment.body.trim() === 'TESTED') {
//            /*console.log(`PR Number: ${pr.number}`);*/
//             hasTestedComment = true;
//             break; // Exit the comment loop since a "TESTED" comment is found
//           }
//         }

//         // Print the "TESTED" comments only if a "TESTED" comment exists
//         if (hasTestedComment) {
//           const pullRequest = await octokit.pulls.get({
//             owner: context.repo.owner,
//             repo: context.repo.repo,
//             pull_number: pr.number,
//           });

//           console.log(`SHA: ${pullRequest.data.head.sha}`);

//           for (const comment of allCommentsForPR.data) {
//             if (comment.body.trim() === 'TESTED') {
//               console.log(`Comment ${comment.id}:`);
//               console.log(comment.body);
//               console.log('--------------------');
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error processing pull request:', error.message);
//       }
//     }
//   } catch (error) {
//     console.error('Error:', error.message);
//     core.setFailed(error.message);
//   }
// }

// main();
