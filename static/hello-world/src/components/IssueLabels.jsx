import React, { useState } from 'react';

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

export default function IssueLabels({ labels, onDeleteLabel, onAddLabel }) {
  const [newLabel, setNewLabel] = useState('');
  return (
    <div>
      <h2>📌 Labels of Current Issue:</h2>
      <div>
        {labels.length === 0 ? (
          <em style={{ color: '#A5ADBA' }}>No labels on this issue.</em>
        ) : (
          labels.map((label, i) => (
            <span key={i} style={labelBtn(false)}>
              {label}
              <button
                style={{ marginLeft: 8, color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                onClick={() => onDeleteLabel(label)}
                title="Delete label"
              >
                ✖
              </button>
            </span>
          ))
        )}
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (newLabel.trim()) {
            onAddLabel(newLabel.trim());
            setNewLabel('');
          }
        }}
        style={{ marginTop: 8 }}
      >
        <input
          type="text"
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          placeholder="Add label"
          style={{ marginRight: 8 }}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}