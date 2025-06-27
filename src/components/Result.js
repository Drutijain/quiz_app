import React from 'react';

function Result({ results,onRestart }) {
  return (
    <div>
      <h2>Quiz Completed!</h2>
      <h3>Your Score: {results.score}/{results.total}</h3>
      <h3>Total Time Taken: {results.totalTime} seconds</h3>
      <button onClick={onRestart}>Back to Domain Selection</button>
    </div>
  );
}

export default Result;