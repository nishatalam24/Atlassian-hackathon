import React, { useEffect, useState } from 'react';
import { events, invoke } from '@forge/bridge';
import IssueLabels from './components/IssueLabels';
import IssuesList from './components/IssuesList';

const cardStyle = {
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  padding: '24px',
  margin: '24px auto',
  maxWidth: '600px',
  fontFamily: 'Segoe UI, Arial, sans-serif',
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

const inputStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginBottom: '12px',
  width: '100%',
  boxSizing: 'border-box',
};

function App() {
  const [issueLabels, setIssueLabels] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableLabels, setAvailableLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [createForm, setCreateForm] = useState({ summary: '', labels: '' });
  const [createStatus, setCreateStatus] = useState('');

  // Fetch labels for current issue
  const fetchLabels = async () => {
    try {
      const labels = await invoke('fetchLabels');
      setIssueLabels(labels);
    } catch (err) {
      console.error('Failed to fetch issue labels:', err);
    }
  };

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
    fetchLabels();
    fetchAllIssues();

    const subscription = events.on('JIRA_ISSUE_CHANGED', () => {
      fetchLabels();
      fetchAllIssues();
    });

    return () => {
      subscription.then(sub => sub.unsubscribe());
    };
  }, []);

  // Filter issues by label
  const handleFilter = (label) => {
    setSelectedLabel(label);
    if (!label) {
      setFilteredIssues(allIssues);
    } else {
      setFilteredIssues(allIssues.filter(issue => issue.labels.includes(label)));
    }
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

  // Add label to current issue
  const handleAddLabel = async (label) => {
    const newLabels = [...issueLabels, label];
    await invoke('updateIssueLabels', { issueKey: allIssues[0]?.key, labels: newLabels });
    setIssueLabels(newLabels);
    fetchAllIssues();
  };

  // Remove label from current issue
  const handleDeleteLabel = async (label) => {
    const newLabels = issueLabels.filter(l => l !== label);
    await invoke('updateIssueLabels', { issueKey: allIssues[0]?.key, labels: newLabels });
    setIssueLabels(newLabels);
    fetchAllIssues();
  };

  // Delete an issue
  const handleDeleteIssue = async (issueKey) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      await invoke('deleteIssue', { issueKey });
      fetchAllIssues();
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</div>;

  return (
    <div style={cardStyle}>
      <h1 style={{ color: '#36B37E', fontSize: '2rem', marginBottom: 0 }}>🔍 Bugscope Panel - BY Nishat</h1>
      <p style={{ color: '#6B778C', marginTop: 4 }}>A better way to view, filter, and create Jira issues.</p>

      <section style={{ marginTop: 24 }}>
        <IssueLabels
          labels={issueLabels}
          onAddLabel={handleAddLabel}
          onDeleteLabel={handleDeleteLabel}
        />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 8 }}>🏷️ Filter Issues by Label:</h2>
        <div style={{ marginBottom: 12 }}>
          <button
            style={labelBtn(selectedLabel === '')}
            onClick={() => handleFilter('')}
          >
            All
          </button>
          {availableLabels.map((label, i) => (
            <button
              key={i}
              style={labelBtn(selectedLabel === label)}
              onClick={() => handleFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 8 }}>📋 Filtered Issues:</h2>
        {filteredIssues.length === 0 ? (
          <p style={{ color: '#A5ADBA' }}>No issues found for selected label.</p>
        ) : (
          <IssuesList issues={filteredIssues} onDelete={handleDeleteIssue} />
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
    </div>
  );
}

export default App;