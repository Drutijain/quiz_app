import React from 'react';

function CompeteNextStep({ onSelect, onClose }) {
  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="modal-content" style={{
        background: '#fff', padding: 32, borderRadius: 8, minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.2)', textAlign: 'center', position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 12, fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
        <h2>What would you like to do next?</h2>
        <button style={{ margin: 8, padding: '8px 16px' }} onClick={() => onSelect('match')}>Match with People Online</button>
        <button style={{ margin: 8, padding: '8px 16px' }} onClick={() => onSelect('room')}>Create a Room & Invite Friends</button>
      </div>
    </div>
  );
}

export default CompeteNextStep;
