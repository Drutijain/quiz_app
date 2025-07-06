import React from 'react';
import './CompeteChoiceModal.css';

function CompeteChoiceModal({ onClose, onSelect }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Choose Compete Mode</h2>
        <button className="modal-btn" onClick={() => { onSelect('online'); onClose(); }}>
          Match with people online
        </button>
        <button className="modal-btn" onClick={() => { onSelect('room'); onClose(); }}>
          Create room and invite
        </button>
        <button className="modal-close" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default CompeteChoiceModal;
