import React from "react";

export function Metric({ icon: Icon, label, value }) {
  return (
    <div className="metric-card">
      <span className="metric-icon">
        <Icon size={19} />
      </span>
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
