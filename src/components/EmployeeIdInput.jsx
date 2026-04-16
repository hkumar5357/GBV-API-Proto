import React from 'react';

export default function EmployeeIdInput({ value, onChange, variant = 'compact' }) {
  if (variant === 'prominent') {
    return (
      <div className="employee-id employee-id--prominent">
        <label htmlFor="employee-id-input">Employee ID</label>
        <input
          id="employee-id-input"
          type="text"
          placeholder="Enter employee identifier"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    );
  }
  return (
    <div className="employee-id employee-id--compact">
      <label htmlFor="employee-id-input">Employee ID (optional)</label>
      <input
        id="employee-id-input"
        type="text"
        placeholder="e.g. EMP-4821"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
