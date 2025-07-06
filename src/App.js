import React, { useState, useEffect, useRef } from 'react';
import DomainSelection from './components/DomainSelection';
import QuizPage from './components/QuizPage';
import Result from './components/Result';
import ModeSelection from './components/ModeSelection';
import CompeteNextStep from './components/CompeteNextStep';
import MultiplayerLoader from './components/MultiplayerLoader'; 
import OnlineMatchLoader from './components/OnlineMatchLoader';
import OnlineQuizPage from './components/OnlineQuizPage';
import RoomInviteFlow from './components/RoomInviteFlow';
import './App.css';

function App() {
  const [mode, setMode] = useState(null);
  const [domain, setDomain] = useState(null);
  const [results, setResults] = useState(null);
  const [theme, setTheme] = useState('light');
  const [competeChoice, setCompeteChoice] = useState(null);
  const [player, setPlayer] = useState(null);
  const [loginStatus, setLoginStatus] = useState('pending'); // 'pending' | 'success' | 'error'
  const [onlineMatch, setOnlineMatch] = useState(null); // { room, participants, isCreator }
  const [onlineDomain, setOnlineDomain] = useState(null);
  const [roomDomain, setRoomDomain] = useState(null);
  const [roomFlowActive, setRoomFlowActive] = useState(false);

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

  const restart = () => {
    setResults(null);
    setDomain(null);
    setMode(null);
    setCompeteChoice(null);
  };

  useEffect(() => {
    // Moitribe SDK login/init
    function tryInitMoitribe() {
      if (typeof window.moitribeGS !== 'function') {
        console.log('[Moitribe] Waiting for SDK...');
        setTimeout(tryInitMoitribe, 200);
        return;
      }
      const gameID = 'gm685a7f2d8b980';
      const params = {
        div: 'root',
        isUnity: false,
        loginCallback: function(loginObj) {
          console.log('[Moitribe] loginCallback:', loginObj);
          if (loginObj.success) {
            setPlayer(loginObj.playerdata);
            setLoginStatus('success');
          } else {
            setPlayer(null);
            setLoginStatus('error');
          }
        }
      };
      const externalParams = {
        tpparams: {
          mchanid: '',
          mautologin: 0,
          muniqueid: ''
        }
      };
      const initParams = Object.assign({}, params, externalParams);
      console.log('[Moitribe] Calling init with:', gameID, initParams);
      window.moitribeGS(gameID, 'init', initParams, function(cbObj) {
        console.log('[Moitribe] Init callback:', cbObj);
        // Do not set loginStatus here; rely on loginCallback only
      });
    }
    tryInitMoitribe();
  }, []);

  if (loginStatus === 'pending') {
    return <div className="App"><h2>Loading... Please wait for login.</h2></div>;
  }
  if (loginStatus === 'error') {
    return <div className="App"><h2>Login failed. Please refresh to try again.</h2></div>;
  }

  return (
    <div className="App">
      <header>
        <h1>Interactive Quiz Portal</h1>
        <button onClick={toggleTheme}>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</button>
      </header>

      {/* Mode selection screen */}
      {!mode && <ModeSelection setMode={setMode} />}

      {/* Practice Mode */}
      {mode === 'practice' && !domain && <DomainSelection setDomain={setDomain} />}
      {mode === 'practice' && domain && !results && <QuizPage domain={domain} setResults={setResults} />}

      {/* Compete Mode Flow */}
      {mode === 'compete' && !competeChoice && <CompeteNextStep onSelect={choice => setCompeteChoice(choice)} />}
      {mode === 'compete' && competeChoice && !domain && <DomainSelection setDomain={setDomain} />}
      {mode === 'compete' && domain && !results && (
        <MultiplayerLoader domain={domain} mode={competeChoice} setResults={setResults} />
      )}

      {/* Online Mode Flow */}
      {mode === 'online' && (
        <>
          {!onlineMatch && !onlineDomain && <DomainSelection setDomain={setOnlineDomain} />}
          {onlineDomain && !onlineMatch && (
            <OnlineMatchLoader
              domain={onlineDomain}
              player={player}
              onMatch={(room, participants, isCreator) => setOnlineMatch({ room, participants, isCreator })}
              onFail={msg => {
                setOnlineMatch(null);
                setOnlineDomain(null);
                alert(msg);
                setMode(null);
              }}
            />
          )}
          {onlineMatch && (
            <OnlineQuizPage
              room={onlineMatch.room}
              participants={onlineMatch.participants}
              player={player}
              isCreator={onlineMatch.isCreator}
              domain={onlineDomain}
              onFinish={(winner, scores) => {
                alert('Winner: ' + winner);
                setOnlineMatch(null);
                setOnlineDomain(null);
                setMode(null);
              }}
            />
          )}
        </>
      )}

      {/* Room Mode Flow */}
      {mode === 'room' && (
        !roomDomain ? (
          <DomainSelection setDomain={setRoomDomain} />
        ) : (
          <RoomInviteFlow
            domain={roomDomain}
            player={player}
            onFinish={(winner, scores) => {
              alert('Winner: ' + winner);
              setRoomDomain(null);
              setRoomFlowActive(false);
              setMode(null);
            }}
            onBack={() => {
              setRoomDomain(null);
              setRoomFlowActive(false);
              setMode(null);
            }}
          />
        )
      )}

      {/* Result screen (shared) */}
      {results && <Result results={results} onRestart={restart} />}
    </div>
  );
}

export default App;
