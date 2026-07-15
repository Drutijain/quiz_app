import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './WaitingRoom.css';

function WaitingRoom({ 
  roomId, 
  isHost, 
  playerNames, 
  showDomainSelection,
  onQuizStart,
  children 
}) {
  return (
    <div style={{ marginTop: 24 }}>
      {showDomainSelection && children}
      
      {isHost && !playerNames[2] && !showDomainSelection && (
        <div className="room-code-container">
          <h3>Your Room Code:</h3>
          <div className="room-code-box">
            <strong>{roomId}</strong>
            <button 
              className="copy-button"
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                const button = document.querySelector('.copy-button');
                button.innerHTML = '✓';
                setTimeout(() => {
                  button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4C3 1 2 2 2 3v14h2V3h12V1zm3 4H8C7 5 6 6 6 7v14c0 1 1 2 2 2h11c1 0 2-1 2-2V7c0-1-1-2-2-2zm0 16H8V7h11v14z"/></svg>';
                }, 1000);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M16 1H4C3 1 2 2 2 3v14h2V3h12V1zm3 4H8C7 5 6 6 6 7v14c0 1 1 2 2 2h11c1 0 2-1 2-2V7c0-1-1-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
          </div>
          <p className="share-text">Share this code with your friend to join</p>
        </div>
      )}

      {isHost && playerNames[2] && (
        <div className="waiting-modal">
          <div className="waiting-modal-content">
            <h3>{playerNames[2]} has joined!</h3>
            <button
              onClick={async () => {
                if (onQuizStart) {
                  onQuizStart();
                  await updateDoc(doc(db, 'rooms', roomId), { quizStarted: true });
                }
              }}
              className="start-quiz-btn"
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}

      {/* For player 2 */}
      {!isHost && (
        <div className="waiting-modal">
          <div className="waiting-modal-content">
            <h3>You've joined room: <strong>{roomId}</strong></h3>
            <div className="waiting-message">
              <h3>Waiting for host to start the quiz...</h3>
              <div className="spinner"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WaitingRoom;
