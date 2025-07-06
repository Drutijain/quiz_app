import React, { useState } from 'react';
import './DomainSelection.css'; 
import practiceImg from '../assets/practice.png'; 
import competeImg from '../assets/compete.png'; 
import CompeteChoiceModal from './CompeteChoiceModal';

const boxStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  padding: '2rem'
};

function ModeSelection({ setMode }) {
  const [showModal, setShowModal] = useState(false);

  const handleCompeteClick = () => {
    setShowModal(true);
  };

  const handleModalSelect = (choice) => {
    setMode(choice); // 'online' or 'room'
  };

  return (
    <>
      <div className="m-card-container" style={boxStyle}>
        <div className="card" onClick={() => setMode('practice')}>
          <img src={practiceImg} alt="Practice" />
          <h3>Practice</h3>
          <p>Single player mode. Practice quizzes at your own pace.</p>
        </div>
        <div className="card" onClick={handleCompeteClick}>
          <img src={competeImg} alt="Compete" />
          <h3>Compete</h3>
          <p>Multiplayer mode. Compete with a friend in real time!</p>
        </div>
      </div>
      {showModal && (
        <CompeteChoiceModal
          onClose={() => setShowModal(false)}
          onSelect={handleModalSelect}
        />
      )}
    </>
  );
}

export default ModeSelection;