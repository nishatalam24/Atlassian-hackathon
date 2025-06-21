import React from 'react';

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

function LabelFilter({ labelSearch, onLabelSearch, filteredLabels, selectedLabel, onFilter }) {
  return (
    <section style={{ marginTop: 24 }}>
      <input
        style={inputStyle}
        type="text"
        placeholder="Search labels or issues..."
        value={labelSearch}
        onChange={onLabelSearch}
      />
      <div style={{ marginBottom: 12, marginTop: 8 }}>
        <button
          style={labelBtn(selectedLabel === '')}
          onClick={() => onFilter('')}
        >
          All
        </button>
        {filteredLabels.map((label, i) => (
          <button
            key={i}
            style={labelBtn(selectedLabel === label)}
            onClick={() => onFilter(label)}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default LabelFilter;