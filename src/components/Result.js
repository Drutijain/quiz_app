
import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './Result.css';

// Helper Arrow component for rating change
function Arrow({ change }) {
  if (change > 0) return <FaArrowUp />;
  if (change < 0) return <FaArrowDown />;
  return null;
}


function Result({ results, onRestart, playerName, playerNum, playerNames, player, rating, debugWinner, debugPlayerId }) {
  // Determine winner name from Firestore or playerNames
  let winnerDisplay = results.winner;
  if (playerNames && results.winner) {
    const winnerNum = results.winner.toLowerCase().includes('1') ? '1' : '2';
    winnerDisplay = playerNames[winnerNum] || results.winner;
  }

  // Calculate rating change and previous/final rating
  const prevRating = results.prevRating !== undefined ? results.prevRating : (rating !== undefined ? rating : 0);
  const finalRating = results.finalRating !== undefined ? results.finalRating : prevRating;
  const ratingChange = finalRating - prevRating;
  const isCompete = results.opponentScore !== undefined;
  const won = isCompete && winnerDisplay && (playerName || (player && player.name)) === winnerDisplay;
  const isDraw = isCompete && results.winner === 'Draw';

  return (
    <div className="result-container">
      <span className="result-eyebrow mono-num">Quiz complete</span>
      <h2>{isCompete ? (isDraw ? "It's a draw!" : won ? 'You won! 🏆' : 'Better luck next time') : 'Nice work!'}</h2>

      <div className="score-section">
        <div className="score-row">
          <div className="score-block">
            <span className="score-block-label">{playerName || (player && player.name) || 'You'}</span>
            <span className="score-block-value mono-num">{results.score}<span className="score-block-total">/{results.total}</span></span>
          </div>
          {isCompete && (
            <>
              <span className="score-vs">vs</span>
              <div className="score-block">
                <span className="score-block-label">{winnerDisplay && !won && !isDraw ? winnerDisplay : 'Opponent'}</span>
                <span className="score-block-value mono-num">{results.opponentScore}<span className="score-block-total">/{results.total}</span></span>
              </div>
            </>
          )}
        </div>
        <div className="time-taken">Total time taken: {results.totalTime}s</div>
      </div>

      {isCompete && (
        <div className="rating-change">
          <span>Rating: <span className="mono-num">{Math.round(prevRating)}</span></span>
          {ratingChange !== 0 ? (
            <span className={ratingChange > 0 ? 'rating-up' : 'rating-down'}>
              <Arrow change={ratingChange} />
              <span className="mono-num">{ratingChange > 0 ? '+' : ''}{ratingChange}</span>
            </span>
          ) : null}
          <span className="rating-final">(final: <span className="mono-num">{Math.round(finalRating)}</span>)</span>
        </div>
      )}

      <button className="restart-btn" onClick={onRestart}>Back to Home</button>
    </div>
  );
}

export default Result;
