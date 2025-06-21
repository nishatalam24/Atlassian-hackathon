// // import Resolver from '@forge/resolver';
// // import api, { route } from '@forge/api';
// // const resolver = new Resolver();

// // resolver.define('fetchLabels', async (req) => {
// //   const key = req.context.extension.issue.key;

// //   const res = await api.asUser().requestJira(route`/rest/api/3/issue/${key}?fields=labels`);

// //   const data = await res.json();

// //   const label = data.fields.labels;
// //   if (label == undefined) {
// //     console.warn(`${key}: Failed to find labels`);
// //     return [];
// //   }

// //   return label;
// // });

// // export const handler = resolver.getDefinitions();


// //working
// import Resolver from '@forge/resolver';
// import api, { route } from '@forge/api';

// const resolver = new Resolver();

// resolver.define('fetchLabels', async (req) => {
//   try {
//     const key = req.context.extension.issue.key;

//     console.log('Fetching labels for issue:', key);

//     const res = await api.asUser().requestJira(
//       route`/rest/api/3/issue/${key}?fields=labels`
//     );

//     const data = await res.json();
//     console.log('Jira API response:', JSON.stringify(data, null, 2));

//     const labels = data?.fields?.labels;

//     if (!labels) {
//       console.warn(`${key}: No labels found`);
//       return [];
//     }

//     return labels;
//   } catch (error) {
//     console.error('Error in fetchLabels:', error);
//     return [];
//   }
// });

// resolver.define('fetchIssuesWithLabels', async () => {
//   const res = await api.asUser().requestJira(route`/rest/api/3/search?jql=project=BTS&fields=summary,labels,key`);

//   const data = await res.json();
//   return data.issues.map(issue => ({
//     key: issue.key,
//     summary: issue.fields.summary,
//     labels: issue.fields.labels || []
//   }));
// });


// export const handler = resolver.getDefinitions();




import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();

resolver.define('fetchLabels', async (req) => {
  const issueKey = req.context.extension.issue.key;
  console.log(`Fetching labels for issue: ${issueKey}`);

  const res = await api.asUser().requestJira(route`/rest/api/3/issue/${issueKey}?fields=labels`);
  const data = await res.json();
  return data.fields.labels || [];
});

resolver.define('fetchIssuesWithLabels', async () => {
  const res = await api
    .asUser()
    .requestJira(route`/rest/api/3/search?jql=project=BTS&fields=summary,labels,key`);
  const data = await res.json();

  return data.issues.map((issue) => ({
    key: issue.key,
    summary: issue.fields.summary,
    labels: issue.fields.labels || [],
  }));
});

export const handler = resolver.getDefinitions();
