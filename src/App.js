import React, { useState, useEffect } from 'react';
import DomainSelection from './components/DomainSelection';
import QuizPage from './components/QuizPage';
import Result from './components/Result';
import ModeSelection from './components/ModeSelection';
import './App.css';

function App() {
  const [mode, setMode] = useState(null);
  const [domain, setDomain] = useState(null);
  const [results, setResults] = useState(null);
  const [theme, setTheme] = useState('light');


  useEffect(() => {
    const handlePopState = () => {
      if (results) {
        setResults(null);
      } else if (domain) {
        setDomain(null);
      } else if (mode) {
        setMode(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [mode, domain, results]);

  
  useEffect(() => {
    if (results || domain || mode) {
      window.history.pushState({}, '');
    }
  }, [mode, domain, results]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="App">
      <header>
        <h1>Interactive Quiz Portal</h1>
        <button onClick={toggleTheme}>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</button>
      </header>
      {!mode && <ModeSelection setMode={setMode} />}
      {mode === 'practice' && !domain && <DomainSelection setDomain={setDomain} />}
      {mode === 'practice' && domain && !results && <QuizPage domain={domain} setResults={setResults} />}
      {results && <Result results={results} 
      onRestart={() => {
            setResults(null);
            setDomain(null);
            setMode(null);
          }}/>} 
    </div>
  );
}

export default App;