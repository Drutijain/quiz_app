import React, { useState } from 'react';
import DomainSelection from './components/DomainSelection';
import QuizPage from './components/QuizPage';
import Result from './components/Result';
import './App.css';

function App() {
  const [domain, setDomain] = useState(null);
  const [results, setResults] = useState(null);
  const [theme, setTheme] = useState('light');

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
      {!domain && <DomainSelection setDomain={setDomain} />}
      {domain && !results && <QuizPage domain={domain} setResults={setResults} />}
      {results && <Result results={results} 
      onRestart={() => {
            setResults(null);
            setDomain(null);
          }}/>}
    </div>
  );
}

export default App;