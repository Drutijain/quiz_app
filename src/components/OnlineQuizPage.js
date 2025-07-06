import React, { useEffect, useState, useRef } from 'react';

/**
 * Props:
 * - room: room object
 * - participants: array of participant IDs
 * - player: current player profile
 * - isCreator: boolean
 * - domain: string
 * - onFinish: function(winnerName, scores)
 */
function OnlineQuizPage({ room, participants, player, isCreator, domain, onFinish }) {
  const [scores, setScores] = useState({}); // { participantId: score }
  const [names, setNames] = useState({}); // { participantId: name }
  const [questionIdx, setQuestionIdx] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [winner, setWinner] = useState(null);
  const [log, setLog] = useState([]);
  const totalQuestions = 5; // For demo, use 5 questions
  const roomRef = useRef(room);

  useEffect(() => {
    // Simulate fetching player names from participants
    const n = {};
    participants.forEach(pid => {
      n[pid] = pid === player.id ? player.name : 'Opponent';
    });
    setNames(n);
    setScores(participants.reduce((acc, pid) => { acc[pid] = 0; return acc; }, {}));
    setQuizStarted(true);
    setLog(l => [...l, '[Quiz] Started!']);
  }, [participants, player]);

  // Simulate answering questions and sending score updates
  useEffect(() => {
    if (!quizStarted || quizFinished) return;
    if (questionIdx >= totalQuestions) {
      setQuizFinished(true);
      // Determine winner
      const maxScore = Math.max(...Object.values(scores));
      const winnerId = Object.keys(scores).find(pid => scores[pid] === maxScore);
      setWinner(names[winnerId]);
      setLog(l => [...l, `[Quiz] Finished! Winner: ${names[winnerId]}`]);
      if (onFinish) onFinish(names[winnerId], scores);
      return;
    }
    // Simulate answering a question
    const t = setTimeout(() => {
      // Randomly increment score for demo
      setScores(prev => {
        const newScores = { ...prev };
        const myId = player.id;
        newScores[myId] += Math.round(Math.random() * 10);
        return newScores;
      });
      setLog(l => [...l, `[Quiz] Q${questionIdx + 1} answered.`]);
      setQuestionIdx(idx => idx + 1);
    }, 1200);
    return () => clearTimeout(t);
  }, [questionIdx, quizStarted, quizFinished, player, scores, names, onFinish]);

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', textAlign: 'center' }}>
      <h2>Quiz: {domain}</h2>
      <div style={{ margin: '1rem 0' }}>
        {participants.map(pid => (
          <div key={pid} style={{ fontWeight: pid === player.id ? 'bold' : 'normal' }}>
            {names[pid]}: {scores[pid]}
          </div>
        ))}
      </div>
      <div style={{ margin: '1.5rem 0' }}>
        {quizFinished ? (
          <h3>Winner: {winner}</h3>
        ) : (
          <h3>Question {questionIdx + 1} / {totalQuestions}</h3>
        )}
      </div>
      <div style={{ textAlign: 'left', margin: '1rem auto', maxWidth: 400, fontSize: '0.95em', color: '#555' }}>
        <div>Debug log:</div>
        <ul>
          {log.map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default OnlineQuizPage;
