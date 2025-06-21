import React from 'react';

function IssuesList({ issues, onAddLabel, onDeleteLabel, onDeleteIssue, inputStyle, labelBtn }) {
  return (
    <>
      {issues.map(issue => (
        <div key={issue.key} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            {issue.summary} <span style={{ color: '#A5ADBA' }}>({issue.key})</span>
          </div>
          <div style={{ marginBottom: 8 }}>
            {issue.labels.map(label => (
              <span key={label} style={{ ...labelBtn(false), marginRight: 4 }}>
                {label}
                <button
                  style={{
                    marginLeft: 6,
                    background: 'transparent',
                    border: 'none',
                    color: '#FF5630',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                  title="Remove label"
                  onClick={() => onDeleteLabel(issue.key, label)}
                >×</button>
              </span>
            ))}
          </div>
          <div>
            <input
              style={{ ...inputStyle, width: 180, display: 'inline-block', marginRight: 8, marginBottom: 0 }}
              type="text"
              placeholder="Add label"
              onKeyDown={e => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  onAddLabel(issue.key, e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
            <button
              style={{
                ...labelBtn(false),
                background: '#36B37E',
                color: '#fff',
                border: 'none',
                fontWeight: 'bold'
              }}
              onClick={e => {
                const input = e.target.previousSibling;
                if (input && input.value.trim()) {
                  onAddLabel(issue.key, input.value.trim());
                  input.value = '';
                }
              }}
              type="button"
            >
              Add
            </button>
            <button
              style={{
                ...labelBtn(false),
                background: '#FF5630',
                color: '#fff',
                border: 'none',
                fontWeight: 'bold',
                marginLeft: 8
              }}
              onClick={() => onDeleteIssue(issue.key)}
              type="button"
            >
              Delete Issue
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default IssuesList;