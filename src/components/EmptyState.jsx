import React from "react";
import { ArrowRight } from "lucide-react";

export function EmptyState({ icon: Icon, title, text, action, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={27} />
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="button button-primary" onClick={onAction}>
        {action} <ArrowRight size={16} />
      </button>
    </div>
  );
}
