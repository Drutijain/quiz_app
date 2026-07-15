import React from 'react';
import './DomainSelection.css';
import './ModeSelection.css';
import practiceImg from '../assets/practice.png'; 
import competeImg from '../assets/compete.png'; 

function ModeSelection({ setMode }) {
  return (
    <div className="mode-container">
      <div className="mode-card" onClick={() => setMode('practice')}>
        <img src={practiceImg} alt="Practice" />
        <h3>Practice</h3>
        <p>Single player mode. Practice quizzes at your own pace.</p>
      </div>
      <div className="mode-card" onClick={() => setMode('compete')}>
        <img src={competeImg} alt="Compete" />
        <h3>Compete</h3>
        <p>Multiplayer mode. Compete with a friend in real time!</p>
      </div>
    </div>
    //   </div>
    // </>
  );
}

export default ModeSelection;