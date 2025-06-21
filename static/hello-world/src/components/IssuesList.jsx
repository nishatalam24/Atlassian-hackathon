import React from 'react';

export default function IssuesList({ issues, onDelete }) {
  return (
    <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
      {issues.map((issue, i) => (
        <li key={i} style={{
          background: '#F4F5F7',
          borderRadius: '6px',
          marginBottom: '10px',
          padding: '10px 14px',
          borderLeft: '4px solid #36B37E',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>{issue.key}:</strong> {issue.summary}
            {issue.labels.length > 0 && (
              <div style={{ fontSize: '0.95em', color: '#6554C0', marginTop: 4 }}>
                Labels: {issue.labels.join(', ')}
              </div>
            )}
          </div>
          <button
            style={{
              background: '#FF5630',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 10px',
              cursor: 'pointer',
              marginLeft: 12
            }}
            onClick={() => onDelete(issue.key)}
            title="Delete issue"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}