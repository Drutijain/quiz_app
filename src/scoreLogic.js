// Returns the new rating based on previous rating, result, and scores
// result: { winner, score, opponentScore }
export function calculateNewRating(prevRating, result, playerNum) {
  let newRating = prevRating || 0;
  if (!result || typeof result.score !== 'number') return newRating;
  if (result.winner === 'Draw') {
    newRating += 5;
  } else if (
    (result.winner === 'Player 1' && playerNum === 1) ||
    (result.winner === 'Player 2' && playerNum === 2)
  ) {
    // Win
    newRating += 10;
  } else {
    // Lose
    newRating -= 5;
  }
  if (newRating < 0) newRating = 0;
  return newRating;
}
