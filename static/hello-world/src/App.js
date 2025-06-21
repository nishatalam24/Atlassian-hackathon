// import React, { useEffect, useState } from 'react';
// import { events, invoke } from '@forge/bridge';
// import LabelFilter from './components/LabelFilter';
// import IssuesList from './components/IssuesList';

// const cardStyle = {
//   background: '#fff',
//   borderRadius: '8px',
//   boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
//   padding: '24px',
//   margin: '24px auto',
//   maxWidth: '600px',
//   fontFamily: 'Segoe UI, Arial, sans-serif',
// };

// const inputStyle = {
//   padding: '8px',
//   borderRadius: '4px',
//   border: '1px solid #ccc',
//   marginBottom: '12px',
//   width: '100%',
//   boxSizing: 'border-box',
// };

// const labelBtn = (active) => ({
//   margin: '4px',
//   padding: '6px 14px',
//   borderRadius: '16px',
//   border: active ? '2px solid #36B37E' : '1px solid #ccc',
//   background: active ? '#E3FCEF' : '#F4F5F7',
//   color: active ? '#006644' : '#333',
//   cursor: 'pointer',
//   fontWeight: active ? 'bold' : 'normal',
//   outline: 'none',
// });

// function App() {
//   const [allIssues, setAllIssues] = useState([]);
//   const [filteredIssues, setFilteredIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [availableLabels, setAvailableLabels] = useState([]);
//   const [selectedLabel, setSelectedLabel] = useState('');
//   const [labelSearch, setLabelSearch] = useState('');
//   const [createForm, setCreateForm] = useState({ summary: '', labels: '' });
//   const [createStatus, setCreateStatus] = useState('');

//   // Fetch all issues with labels
//   const fetchAllIssues = async () => {
//     try {
//       const issues = await invoke('fetchIssuesWithLabels');
//       setAllIssues(issues);
//       setFilteredIssues(issues);
//       const allLabels = new Set();
//       issues.forEach(issue => issue.labels.forEach(label => allLabels.add(label)));
//       setAvailableLabels([...allLabels]);
//     } catch (err) {
//       console.error('Failed to fetch all issues:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllIssues();
//     const subscription = events.on('JIRA_ISSUE_CHANGED', fetchAllIssues);
//     return () => { subscription.then(sub => sub.unsubscribe()); };
//   }, []);

//   // Filter issues by label and search
//   const filterIssues = (label, search) => {
//     let filtered = allIssues;
//     if (label) {
//       filtered = filtered.filter(issue =>
//         issue.labels.some(l => l.toLowerCase() === label.toLowerCase())
//       );
//     }
//     if (search.trim() !== '') {
//       const s = search.trim().toLowerCase();
//       filtered = filtered.filter(issue =>
//         issue.summary.toLowerCase().includes(s) ||
//         issue.labels.some(l => l.toLowerCase().includes(s))
//       );
//     }
//     setFilteredIssues(filtered);
//   };

//   // Handle label filter button
//   const handleFilter = (label) => {
//     setSelectedLabel(label);
//     filterIssues(label, labelSearch);
//   };

//   // Handle search input
//   const handleLabelSearch = (e) => {
//     setLabelSearch(e.target.value);
//     filterIssues(selectedLabel, e.target.value);
//   };

//   // Handle create issue form input
//   const handleInputChange = (e) => {
//     setCreateForm({ ...createForm, [e.target.name]: e.target.value });
//   };

//   // Create issue handler
//   const handleCreateIssue = async (e) => {
//     e.preventDefault();
//     setCreateStatus('Creating...');
//     try {
//       await invoke('createIssue', {
//         summary: createForm.summary,
//         labels: createForm.labels.split(',').map(l => l.trim()).filter(Boolean),
//       });
//       setCreateStatus('Issue created!');
//       setCreateForm({ summary: '', labels: '' });
//       fetchAllIssues();
//     } catch (err) {
//       setCreateStatus('Failed to create issue.');
//       console.error(err);
//     }
//     setTimeout(() => setCreateStatus(''), 2000);
//   };

//   // Add label to a specific issue
//   const handleAddLabel = async (issueKey, label) => {
//     if (!label) return;
//     const issue = allIssues.find(i => i.key === issueKey);
//     if (!issue) return;
//     const newLabels = [...new Set([...issue.labels, label])];
//     await invoke('updateIssueLabels', { issueKey, labels: newLabels });
//     fetchAllIssues();
//   };

//   // Remove label from a specific issue
//   const handleDeleteLabel = async (issueKey, label) => {
//     const issue = allIssues.find(i => i.key === issueKey);
//     if (!issue) return;
//     const newLabels = issue.labels.filter(l => l !== label);
//     await invoke('updateIssueLabels', { issueKey, labels: newLabels });
//     fetchAllIssues();
//   };

//   // Delete an issue
//   const handleDeleteIssue = async (issueKey) => {
//     if (window.confirm('Are you sure you want to delete this issue?')) {
//       await invoke('deleteIssue', { issueKey });
//       fetchAllIssues();
//     }
//   };

//   // Filter available labels based on search
//   const filteredLabels = availableLabels.filter(label =>
//     label.toLowerCase().includes(labelSearch.trim().toLowerCase())
//   );

//   if (loading) return <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</div>;

//   return (
//     <div style={cardStyle}>
//       <h1 style={{ color: '#36B37E', fontSize: '2rem', marginBottom: 0 }}>🔍 Bugscope Panel - BY Nishat</h1>
//       <p style={{ color: '#6B778C', marginTop: 4 }}>A better way to view, filter, and create Jira issues.</p>

//       <LabelFilter
//         labelSearch={labelSearch}
//         onLabelSearch={handleLabelSearch}
//         filteredLabels={filteredLabels}
//         selectedLabel={selectedLabel}
//         onFilter={handleFilter}
//       />

//       <section style={{ marginTop: 24 }}>
//         <h2 style={{ fontSize: '1.1rem', marginBottom: 8 }}>📋 Filtered Issues:</h2>
//         {filteredIssues.length === 0 ? (
//           <p style={{ color: '#A5ADBA' }}>No issues found for search/filter.</p>
//         ) : (
//           <IssuesList
//             issues={filteredIssues}
//             onAddLabel={handleAddLabel}
//             onDeleteLabel={handleDeleteLabel}
//             onDeleteIssue={handleDeleteIssue}
//             inputStyle={inputStyle}
//             labelBtn={labelBtn}
//           />
//         )}
//       </section>

//       <section style={{ marginTop: 32 }}>
//         <h2 style={{ fontSize: '1.1rem', marginBottom: 8 }}>➕ Create New Issue</h2>
//         <form onSubmit={handleCreateIssue} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//           <input
//             style={inputStyle}
//             type="text"
//             name="summary"
//             placeholder="Issue summary"
//             value={createForm.summary}
//             onChange={handleInputChange}
//             required
//           />
//           <input
//             style={inputStyle}
//             type="text"
//             name="labels"
//             placeholder="Comma-separated labels (e.g. bug,ui)"
//             value={createForm.labels}
//             onChange={handleInputChange}
//           />
//           <button
//             type="submit"
//             style={{
//               ...labelBtn(false),
//               background: '#36B37E',
//               color: '#fff',
//               border: 'none',
//               marginTop: 8,
//               fontWeight: 'bold'
//             }}
//           >
//             Create Issue
//           </button>
//           {createStatus && <span style={{ color: '#36B37E', marginTop: 4 }}>{createStatus}</span>}
//         </form>
//       </section>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState } from 'react';
import { events, invoke } from '@forge/bridge';
import LabelFilter from './components/LabelFilter';
import IssuesList from './components/IssuesList';
import WeatherPanel from './components/WeatherPanel';

const cardStyle = {
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  padding: '24px',
  margin: '24px auto',
  maxWidth: '600px',
  fontFamily: 'Segoe UI, Arial, sans-serif',
};

const inputStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginBottom: '12px',
  width: '100%',
  boxSizing: 'border-box',
};

const labelBtn = (active) => ({
  margin: '4px',
  padding: '6px 14px',
  borderRadius: '16px',
  border: active ? '2px solid #36B37E' : '1px solid #ccc',
  background: active ? '#E3FCEF' : '#F4F5F7',
  color: active ? '#006644' : '#333',
  cursor: 'pointer',
  fontWeight: active ? 'bold' : 'normal',
  outline: 'none',
});

function App() {
  const [allIssues, setAllIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableLabels, setAvailableLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [labelSearch, setLabelSearch] = useState('');
  const [createForm, setCreateForm] = useState({ summary: '', labels: '' });
  const [createStatus, setCreateStatus] = useState('');
  const [activeTab, setActiveTab] = useState('issues'); // 'issues' or 'weather'

  // Fetch all issues with labels
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
    fetchAllIssues();
    const subscription = events.on('JIRA_ISSUE_CHANGED', fetchAllIssues);
    return () => { subscription.then(sub => sub.unsubscribe()); };
  }, []);

  // Filter issues by label and search
  const filterIssues = (label, search) => {
    let filtered = allIssues;
    if (label) {
      filtered = filtered.filter(issue =>
        issue.labels.some(l => l.toLowerCase() === label.toLowerCase())
      );
    }
    if (search.trim() !== '') {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(issue =>
        issue.summary.toLowerCase().includes(s) ||
        issue.labels.some(l => l.toLowerCase().includes(s))
      );
    }
    setFilteredIssues(filtered);
  };

  // Handle label filter button
  const handleFilter = (label) => {
    setSelectedLabel(label);
    filterIssues(label, labelSearch);
  };

  // Handle search input
  const handleLabelSearch = (e) => {
    setLabelSearch(e.target.value);
    filterIssues(selectedLabel, e.target.value);
  };

  // Handle create issue form input
  const handleInputChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  // Create issue handler
  const handleCreateIssue = async (e) => {
    e.preventDefault();
    setCreateStatus('Creating...');
    try {
      await invoke('createIssue', {
        summary: createForm.summary,
        labels: createForm.labels.split(',').map(l => l.trim()).filter(Boolean),
      });
      setCreateStatus('Issue created!');
      setCreateForm({ summary: '', labels: '' });
      fetchAllIssues();
    } catch (err) {
      setCreateStatus('Failed to create issue.');
      console.error(err);
    }
    setTimeout(() => setCreateStatus(''), 2000);
  };

  // Add label to a specific issue
  const handleAddLabel = async (issueKey, label) => {
    if (!label) return;
    const issue = allIssues.find(i => i.key === issueKey);
    if (!issue) return;
    const newLabels = [...new Set([...issue.labels, label])];
    await invoke('updateIssueLabels', { issueKey, labels: newLabels });
    fetchAllIssues();
  };

  // Remove label from a specific issue
  const handleDeleteLabel = async (issueKey, label) => {
    const issue = allIssues.find(i => i.key === issueKey);
    if (!issue) return;
    const newLabels = issue.labels.filter(l => l !== label);
    await invoke('updateIssueLabels', { issueKey, labels: newLabels });
    fetchAllIssues();
  };

  // Delete an issue
  const handleDeleteIssue = async (issueKey) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      await invoke('deleteIssue', { issueKey });
      fetchAllIssues();
    }
  };

  // Filter available labels based on search
  const filteredLabels = availableLabels.filter(label =>
    label.toLowerCase().includes(labelSearch.trim().toLowerCase())
  );

  if (loading) return <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</div>;

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <button
          onClick={() => setActiveTab('issues')}
          style={{
            ...labelBtn(activeTab === 'issues'),
            marginRight: 8,
            background: activeTab === 'issues' ? '#36B37E' : '#F4F5F7',
            color: activeTab === 'issues' ? '#fff' : '#333'
          }}
        >
          🐞 Issue Panel
        </button>
        <button
          onClick={() => setActiveTab('weather')}
          style={{
            ...labelBtn(activeTab === 'weather'),
            background: activeTab === 'weather' ? '#0052CC' : '#F4F5F7',
            color: activeTab === 'weather' ? '#fff' : '#333'
          }}
        >
          🌤️ Weather
        </button>
      </div>
      {activeTab === 'issues' ? (
        <>
          <h1 style={{ color: '#36B37E', fontSize: '2rem', marginBottom: 0 }}>🔍 Bugscope Panel - BY Nishat</h1>
          <p style={{ color: '#6B778C', marginTop: 4 }}>A better way to view, filter, and create Jira issues.</p>

          <LabelFilter
            labelSearch={labelSearch}
            onLabelSearch={handleLabelSearch}
            filteredLabels={filteredLabels}
            selectedLabel={selectedLabel}
            onFilter={handleFilter}
          />

          <section style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 8 }}>📋 Filtered Issues:</h2>
            {filteredIssues.length === 0 ? (
              <p style={{ color: '#A5ADBA' }}>No issues found for search/filter.</p>
            ) : (
              <IssuesList
                issues={filteredIssues}
                onAddLabel={handleAddLabel}
                onDeleteLabel={handleDeleteLabel}
                onDeleteIssue={handleDeleteIssue}
                inputStyle={inputStyle}
                labelBtn={labelBtn}
              />
            )}
          </section>

          <section style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 8 }}>➕ Create New Issue</h2>
            <form onSubmit={handleCreateIssue} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                style={inputStyle}
                type="text"
                name="summary"
                placeholder="Issue summary"
                value={createForm.summary}
                onChange={handleInputChange}
                required
              />
              <input
                style={inputStyle}
                type="text"
                name="labels"
                placeholder="Comma-separated labels (e.g. bug,ui)"
                value={createForm.labels}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                style={{
                  ...labelBtn(false),
                  background: '#36B37E',
                  color: '#fff',
                  border: 'none',
                  marginTop: 8,
                  fontWeight: 'bold'
                }}
              >
                Create Issue
              </button>
              {createStatus && <span style={{ color: '#36B37E', marginTop: 4 }}>{createStatus}</span>}
            </form>
          </section>
        </>
      ) : (
        <WeatherPanel />
      )}
    </div>
  );
}

export default App;