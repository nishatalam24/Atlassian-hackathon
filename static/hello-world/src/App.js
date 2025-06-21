// import React, { useEffect, useState } from 'react';
// import { events, invoke } from '@forge/bridge';

// function App() {
//   const [data, setData] = useState(null);

//   const handleFetchSuccess = (data) => {
//     setData(data);
//     if (data.length === 0) {
//       throw new Error('No labels returned');
//     }
//   };
//   const handleFetchError = () => {
//     console.error('Failed to get label');
//   };

//   useEffect(() => {
//     const fetchLabels = async () => invoke('fetchLabels');
//     fetchLabels().then(handleFetchSuccess).catch(handleFetchError);
//     const subscribeForIssueChangedEvent = () =>
//       events.on('JIRA_ISSUE_CHANGED', () => {
//         fetchLabels().then(handleFetchSuccess).catch(handleFetchError);
//       });
//     const subscription = subscribeForIssueChangedEvent();

//     return () => {
//       subscription.then((subscription) => subscription.unsubscribe());
//     };
//   }, []);

//   if (!data) {
//     return <div>Loading...</div>;
//   }
//   const labels = data.map((label) => <div>{label}</div>);
//   return (
//     <div>
//       <h1>This is Nishat</h1>
//       <span>Issue labels: </span>
//       <div>{labels}</div>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState } from 'react';
import { events, invoke } from '@forge/bridge';

function App() {
  const [issueLabels, setIssueLabels] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableLabels, setAvailableLabels] = useState([]);

  const fetchLabels = async () => {
    try {
      const labels = await invoke('fetchLabels');
      setIssueLabels(labels);
    } catch (err) {
      console.error('Failed to fetch issue labels:', err);
    }
  };

  const fetchAllIssues = async () => {
    try {
      const issues = await invoke('fetchIssuesWithLabels');
      setAllIssues(issues);
      setFilteredIssues(issues);
      const allLabels = new Set();
      issues.forEach(issue => issue.labels.forEach(label => allLabels.add(label)));
      setAvailableLabels([...allLabels]);
    } catch (err) {
      console.error('Failed to fetch all issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
    fetchAllIssues();

    const subscription = events.on('JIRA_ISSUE_CHANGED', () => {
      fetchLabels();
    });

    return () => {
      subscription.then(sub => sub.unsubscribe());
    };
  }, []);

  const handleFilter = (label) => {
    const filtered = allIssues.filter(issue => issue.labels.includes(label));
    setFilteredIssues(filtered);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>

      <input type="text" placeholder="Search issues..." style={{ marginBottom: '10px' }} />
      <h1>🔍 Bugscope Panel - Nishat</h1>

      <h2>📌 Labels of Current Issue:</h2>
      <div>
        {issueLabels.length === 0 ? (
          <em>No labels on this issue.</em>
        ) : (
          issueLabels.map((label, i) => <span key={i}>🔖 {label} &nbsp;</span>)
        )}
      </div>

      <h2>🏷️ Filter Issues by Label:</h2>
      {availableLabels.map((label, i) => (
        <button key={i} onClick={() => handleFilter(label)} style={{ margin: '4px' }}>
          {label}
        </button>
      ))}

      <h2>📋 Filtered Issues:</h2>
      {filteredIssues.length === 0 ? (
        <p>No issues found for selected label.</p>
      ) : (
        <ul>
          {filteredIssues.map((issue, i) => (
            <li key={i}>
              <strong>{issue.key}:</strong> {issue.summary}
              {issue.labels.length > 0 && (
                <div style={{ fontSize: 'small' }}>
                  Labels: {issue.labels.join(', ')}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

