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



resolver.define('createIssue', async ({ payload }) => {
  const { summary, labels } = payload;

  const res = await api.asUser().requestJira(route`/rest/api/3/issue`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fields: {
        project: {
          key: 'BTS'
        },
        summary: summary,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This issue was created using Forge API'
                }
              ]
            }
          ]
        },
        issuetype: {
          name: 'Task'
        },
        labels: labels // <-- use labels from the form
      }
    })
  });

  const data = await res.json();
  return data;
});

resolver.define('updateIssueLabels', async ({ payload }) => {
  const { issueKey, labels } = payload;
  const res = await api.asUser().requestJira(route`/rest/api/3/issue/${issueKey}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fields: { labels }
    })
  });
  return { success: res.ok };
});


resolver.define('deleteIssue', async ({ payload }) => {
  const { issueKey } = payload;
  const res = await api.asUser().requestJira(route`/rest/api/3/issue/${issueKey}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' }
  });
  return { success: res.ok };
});

export const handler = resolver.getDefinitions();
