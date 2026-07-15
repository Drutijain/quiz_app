import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import questionsData from '../data/questions';
import './QuizPage.css';

function QuizPage({ domain, setResults, roomId, player, isWaitingToStart, setIsWaitingToStart, mode }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timer, setTimer] = useState(20);
  const [totalTime, setTotalTime] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  // Ref to prevent double lock/advance
  const isLockedRef = useRef(false);

  // Listen to room state for multiplayer
  useEffect(() => {
    if (!roomId) {
      setQuestions(questionsData[domain?.toLowerCase()] || []);
      setQuizStarted(true);
      return;
    }
    const unsub = onSnapshot(doc(db, "rooms", roomId), (docSnap) => {
      const data = docSnap.data();
      if (data) {
        if (data.domain && questions.length === 0) {
          setQuestions(questionsData[data.domain.toLowerCase()] || []);
        }
        if (typeof data.quizStarted === 'boolean') {
          setQuizStarted(data.quizStarted);
        }
        const opp = player === 1 ? 2 : 1;
        if (data.quizState) {
          setOpponentScore(data.quizState[`score${opp}`] || 0);
          // If both finished, show result
          if (
            data.quizState[`finished1`] &&
            data.quizState[`finished2`]
          ) {
            let winner = "Draw";
            // Use player IDs if available, else fallback to names
            const player1Id = data.player1Id || data.player1Name || 'Player 1';
            const player2Id = data.player2Id || data.player2Name || 'Player 2';
            if (data.quizState.score1 > data.quizState.score2) winner = player1Id;
            if (data.quizState.score2 > data.quizState.score1) winner = player2Id;
            // Calculate totalTime for this player
            const myTime = data.quizState[`time${player}`] || totalTime;
            const resultObject = {
              score: data.quizState[`score${player}`],
              total: questions.length,
              totalTime: myTime,
              opponentScore: data.quizState[`score${opp}`],
              winner,
              debug: {
                quizState: data.quizState,
                player,
                opp,
                player1Id,
                player2Id,
                myTime,
                questionsLength: questions.length
              }
            };
            console.log('[QuizPage.js] Calling setResults with:', resultObject);
            setResults(resultObject);
          }
        }
      }
    });
    return () => unsub();
    // eslint-disable-next-line
  }, [roomId, player, setResults, questions.length, totalTime, domain]);

  // Timer logic
  useEffect(() => {
    if (!quizStarted || locked || current >= questions.length) return;
    isLockedRef.current = false;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          if (!isLockedRef.current) handleLock(true); // true = timeout
          return 0;
        }
        return prev - 1;
      });
      setTotalTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [current, locked, quizStarted, questions.length]);

  // Update Firestore on answer
  // Fix: Only advance one question per timeout/lock, and track time per question
  const handleLock = async (timeout = false) => {
    if (locked || isLockedRef.current) return; // Prevent double lock
    setLocked(true);
    isLockedRef.current = true;
    const correct = questions[current].answer;
    const isCorrect = !timeout && questions[current].options[selected] === correct;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (roomId) {
      // Multiplayer: update Firestore
      const docRef = doc(db, "rooms", roomId);
      const docSnap = await getDoc(docRef);
      const quizState = docSnap.data().quizState || {};
      quizState[`score${player}`] = newScore;
      quizState[`current${player}`] = current + 1;
      quizState[`time${player}`] = (quizState[`time${player}`] || 0) + (20 - timer);
      if (current + 1 === questions.length) {
        quizState[`finished${player}`] = true;
        console.log('[QuizPage.js] Player', player, 'finished. quizState:', quizState);
      }
      await updateDoc(docRef, { quizState });
    }

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent((prev) => prev + 1);
        setSelected(null);
        setTimer(20);
        setLocked(false);
        isLockedRef.current = false;
      } else if (!roomId) {
        // In practice mode, send results when quiz ends
        setResults({
          score: newScore,
          total: questions.length,
          totalTime: totalTime
        });
      }
    }, 1500);
  };

  const handleStartQuiz = async () => {
    if (roomId) {
      // Ensure both player IDs are set in the room document
      const docRef = doc(db, 'rooms', roomId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      let updateObj = { quizStarted: true };
      if (player === 1 && player && player.id && !data.player1Id) {
        updateObj.player1Id = player.id;
      }
      if (player === 2 && player && player.id && !data.player2Id) {
        updateObj.player2Id = player.id;
      }
      await updateDoc(docRef, updateObj);
    }
    setQuizStarted(true);
    if (setIsWaitingToStart) setIsWaitingToStart(false);
  };

  if (!questions.length) return <div className="wait"><h2>No questions available</h2></div>;
  if (roomId && !quizStarted) {
    if (player === 1) {
      return (
        <div className="wait">
          <button className="start-quiz-btn" onClick={handleStartQuiz}>Start Quiz</button>
        </div>
      );
    } else {
      if (setIsWaitingToStart) setIsWaitingToStart(true);
      return null;
    }
  }

  const question = questions[current];

  const handleSkip = () => {
    if (locked) return;
    if (current + 1 >= questions.length) {
      // If this is the last question in practice mode
      if (!roomId) {
        setResults({
          score: score,
          total: questions.length,
          totalTime: totalTime
        });
      }
      return;
    }
    setCurrent(current + 1);
    setSelected(null);
    setTimer(20);
    setLocked(false);
    isLockedRef.current = false;
  };

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const timerPct = Math.max(0, Math.min(100, (timer / 20) * 100));

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button 
          className="back-btn" 
          onClick={() => window.confirm("Are you sure you want to exit? Your progress will be lost.") && window.location.reload()}
        >
          ← Back
        </button>
        <div className="scoreboard">
          <div className="score-chip">
            <span className="score-chip-label">You</span>
            <span className="mono-num score-chip-value">{score}</span>
          </div>
          {/* Only show opponent score in compete mode */}
          {mode === 'compete' && roomId && (
            <div className="score-chip score-chip-opponent">
              <span className="score-chip-label">Opponent</span>
              <span className="mono-num score-chip-value">{opponentScore}</span>
            </div>
          )}
        </div>
      </div>
      <div className="question-box">
        <div className="question-meta">
          <span className="q-index mono-num">Q{current + 1}<span className="q-index-total">/{questions.length}</span></span>
          <div
            className={`timer-ring ${timer <= 5 ? 'red' : ''}`}
            style={{ '--pct': `${timerPct}%` }}
          >
            <span className="mono-num">{timer}</span>
          </div>
        </div>
        <h2>{question.question}</h2>
        <div className="options">
          {question.options && question.options.map((opt, i) => (
            <button
              key={i}
              className={`option 
                ${locked && question.options[i] === question.answer ? 'correct' : ''} 
                ${locked && selected === i && question.options[i] !== question.answer ? 'wrong' : ''} 
                ${selected === i && !locked ? 'selected' : ''}`}
              onClick={() => !locked && setSelected(i)}
              disabled={locked}
            >
              <span className="option-letter">{optionLetters[i]}</span>
              <span className="option-text">{opt}</span>
            </button>
          ))}
        </div>
        <div className="question-controls">
          {selected !== null && !locked && <button onClick={() => handleLock(false)} className="lock-btn">Lock Answer</button>}
          {!locked && <button onClick={handleSkip} className="skip-btn">Skip Question</button>}
          {locked && <p className="locking">Locking your answer&hellip;</p>}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;