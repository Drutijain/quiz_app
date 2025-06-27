import React, { useEffect, useState } from 'react';
import questionsData from '../data/questions';
import './QuizPage.css';

function QuizPage({ domain, setResults }) {
  const questions = questionsData[domain.toLowerCase()] || [];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (locked || current >= questions.length) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          handleLock();
          return 0;
        }
        return prev - 1;
      });
      setTotalTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [current, locked]);

  const handleLock = () => {
  setLocked(true);
  const correct = questions[current].answer;
  const isCorrect = question.options[selected] === correct;

  if (isCorrect) {
    setScore((prev) => prev + 1);
  }

  setTimeout(() => {
    const finalScore = isCorrect ? score + 1 : score;

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setTimer(20);
      setLocked(false);
    } else {
      setResults({ score: finalScore, total: questions.length, totalTime });
    }
  }, 1500);
};


  if (!questions.length) return <div>No Questions Available</div>;

  const question = questions[current];
  return (
    <div className="quiz-container">
      <div className="question-box">
      <div className={`timer ${timer <= 5 ? 'red' : ''}`}><span id='qno'>{current+1}.</span> <span>{timer}s</span></div>
        <h2>{question.question}</h2>
        <div className="options">
          {question.options.map((opt, i) => (
            <button
              key={i}
              className={`option 
  ${locked && question.options[i] === question.answer ? 'correct' : ''} 
  ${locked && selected === i && question.options[i] !== question.answer ? 'wrong' : ''} 
  ${selected === i && !locked ? 'selected' : ''}`}

              onClick={() => !locked && setSelected(i)}
              disabled={locked}
            >
              {opt}
            </button>
          ))}
        </div>
        {selected !== null && !locked && <button onClick={handleLock} className="lock-btn">Lock Answer</button>}
        {locked && <p className="locking">Locking your answer...</p>}
      </div>
    </div>
  );
}

export default QuizPage;
