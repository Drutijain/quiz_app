import React, { useState, useEffect } from 'react';
import Leaderboard from './components/Leaderboard';
import HamburgerMenu from './components/HamburgerMenu';
import RoomCreation from './components/compete/RoomCreation';
import WaitingRoom from './components/compete/WaitingRoom';
import ModeSelection from './components/ModeSelection';
import { getDoc, setDoc } from 'firebase/firestore';
import DomainSelection from './components/DomainSelection';
import QuizPage from './components/QuizPage';
import Result from './components/Result';
import Profile from './components/Profile';
import { useState as useLocalState } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import './App.css';

function App() {
  const [mode, setMode] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [player, setPlayer] = useState(null); 
  const [playerNum, setPlayerNum] = useState(null); 
  const [domain, setDomain] = useState(null);
  const [results, setResults] = useState(null);
  const [playerNames, setPlayerNames] = useState({}); 
  const [theme, setTheme] = useState('light');

  //Rating
  const [rating, setRating] = useState(0);

  // Profile modal 
  const [showProfile, setShowProfile] = useState(false);

  // Leaderboard modal state
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Moitribe login/init states
  const [loginStatus, setLoginStatus] = useState('pending'); 

  const [quizStarted, setQuizStarted] = useLocalState(false);

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

            const userId = loginObj.playerdata.id || loginObj.playerdata.name;
            if (userId) {
              const userRef = doc(db, 'users', userId);
              getDoc(userRef)
                .then(userSnap => {
                  if (userSnap.exists() && typeof userSnap.data().rating === 'number') {
                    setRating(userSnap.data().rating);
                  } else {
                    setRating(100);
                  }
                })
                .catch(() => setRating(100));
            }
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
      });
    }
    tryInitMoitribe();
  }, []);

  // Listen for domain selection, quiz start/result sync, and player names in compete mode
  useEffect(() => {
    let unsub = null;
    if (mode === 'compete' && roomId) {
      unsub = onSnapshot(doc(db, 'rooms', roomId), (docSnap) => {
        const data = docSnap.data();
        console.log('[Firestore Sync] Room snapshot:', data);
        if (data) {
          if (playerNum === 2 && data.domain && !domain) {
            console.log('[Domain Sync] Setting domain for joiner:', data.domain);
            setDomain(data.domain);
          }
          if (data.quizStarted && !quizStarted) {
            console.log('[Quiz Sync] Quiz started!');
            setQuizStarted(true);
          }
          if (data.resultObj && !results) {
            console.log('[Result Sync] Setting results from Firestore:', data.resultObj);
            setResults(prev => {
              return prev ? prev : data.resultObj;
            });
          }
          if (data.player1Name || data.player2Name) {
            console.log('[Player Names Sync] Setting player names:', data.player1Name, data.player2Name);
            setPlayerNames({ 1: data.player1Name, 2: data.player2Name });
          }
        }
      });
    }
    return () => { if (unsub) unsub(); };
  }, [mode, roomId, playerNum, domain, quizStarted, results]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (loginStatus === 'pending') {
    return (
      <div className="App wait">
        <div className="spinner" style={{ marginBottom: '1.2rem' }}></div>
        <h2>Loading&hellip; please wait for login</h2>
      </div>
    );
  }
  if (loginStatus === 'error') {
    return (
      <div className="App wait">
        <h2>Login failed</h2>
        <p>Please refresh to try again.</p>
      </div>
    );
  }

  // Waiting for host to start quiz 
  if (mode === 'compete' && roomId && playerNum === 2 && domain && !quizStarted && !results) {
    return (
      <div className="App wait">
        <div className="spinner" style={{ marginBottom: '1.2rem' }}></div>
        <h2>Waiting for the host to start the quiz&hellip;</h2>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <div className="brand">
          <div className="brand-mark">Q</div>
          <div>
            <h1>Interactive Quiz Portal</h1>
            <span className="brand-sub">Practice · Compete · Climb</span>
          </div>
        </div>
        <HamburgerMenu
          onProfile={() => {
            setShowProfile(true);
            if (typeof window.moitribeGS === 'function') {
              window.moitribeGS('gm685a7f2d8b980', 'getprofile', {}, function(profileObj) {
                if (profileObj && profileObj.success && profileObj.playerdata) {
                  setPlayer(profileObj.playerdata);
                  const userId = profileObj.playerdata.id || profileObj.playerdata.name;
                  if (userId) {
                    const userRef = doc(db, 'users', userId);
                    getDoc(userRef).then(userSnap => {
                      if (userSnap.exists() && typeof userSnap.data().rating === 'number') {
                        setRating(userSnap.data().rating);
                      } else {
                        setRating(0);
                      }
                    }).catch(() => setRating(0));
                  }
                }
              });
            }
          }}
          onLeaderboard={() => setShowLeaderboard(true)}
          onToggleTheme={toggleTheme}
          theme={theme}
        />
      </header>
      {!mode && <ModeSelection setMode={setMode} />}
      {showProfile && (
        <Profile
          player={player}
          onClose={() => setShowProfile(false)}
          rating={rating}
        />
      )}
      {showLeaderboard && (
        <Leaderboard
          onClose={() => setShowLeaderboard(false)}
        />
      )}
      {mode === 'practice' && !domain && <DomainSelection setDomain={setDomain} />}

      {mode === 'compete' && !roomId && (
        <RoomCreation
          player={player}
          onRoomCreated={(newRoomId, playerNumber) => {
            setRoomId(newRoomId);
            setPlayerNum(playerNumber);
          }}
        />
      )}
      
      {/* Domain selection and room sharing for host */}
      {mode === 'compete' && roomId && playerNum === 1 && !domain && (
        <WaitingRoom
          roomId={roomId}
          isHost={true}
          playerNames={playerNames}
          showDomainSelection={true}
        >
          <DomainSelection setDomain={async (d) => {
            setDomain(d);
            await updateDoc(doc(db, 'rooms', roomId), { domain: d });
          }} />
        </WaitingRoom>
      )}

      {/* Quiz Page */}
      {((mode === 'practice' && domain) || (mode === 'compete' && roomId && domain)) && !results && (mode === 'practice' || quizStarted) && (
        <QuizPage
          domain={domain}
          setResults={async (res) => {
            console.log('[App.js] TOP OF setResults callback. Received:', res);
            let resultObj = null;
            
            if (mode === 'practice') {
              // In practice mode, just set the results without rating updates
              resultObj = {
                ...res,
                score: res.score,
                total: res.total,
                totalTime: res.totalTime
              };
              setResults(resultObj);
            } else if (mode === 'compete') {
              let userId = player && player.id ? player.id : null;
              console.log('[QuizPage Callback] userId for rating update:', userId);
              
              if (userId) {
                try {
                  const userRef = doc(db, 'users', userId);
                  const userSnap = await getDoc(userRef);
                  const prevRating = (userSnap.exists() && typeof userSnap.data().rating === 'number') ? userSnap.data().rating : 100;
                  let newRating = prevRating;
                  let ratingChange = 0;
                  
                  if (res.winner && res.winner !== 'Draw') {
                    if (player && player.id && res.winner === player.id) {
                      newRating = prevRating + 10;
                      ratingChange = 10;
                    } else {
                      if (prevRating > 100) {
                        newRating = prevRating - 10;
                        ratingChange = -10;
                      } else {
                        newRating = prevRating;
                        ratingChange = 0;
                      }
                    }
                  }
                  
                  await setDoc(userRef, { rating: newRating, name: player && player.name ? player.name : '' }, { merge: true });
                  const updatedSnap = await getDoc(userRef);
                  const latestRating = (updatedSnap.exists() && typeof updatedSnap.data().rating === 'number') ? updatedSnap.data().rating : newRating;
                  setRating(latestRating);
                  resultObj = {
                    ...res,
                    prevRating,
                    ratingChange,
                    finalRating: latestRating,
                    debugWinner: res.winner,
                    debugPlayerId: player && player.id
                  };
                  setResults(resultObj);
                } catch (err) {
                  console.error('[Firestore] Failed to update rating:', err);
                  resultObj = {
                    ...res,
                    prevRating: 0,
                    ratingChange: 0,
                    finalRating: 0,
                    debugWinner: res.winner,
                    debugPlayerId: player && player.id
                  };
                  setResults(resultObj);
                }
              } else {
                resultObj = { ...res };
                setResults(resultObj);
              }

              if (mode === 'compete' && roomId && resultObj) {
                if (playerNum === 2 && player && player.name) {
                  resultObj.player2Name = player.name;
                }
                console.log('[QuizPage Callback] Writing resultObj to Firestore:', resultObj);
                await updateDoc(doc(db, 'rooms', roomId), { resultObj });
                console.log('[QuizPage Callback] Firestore updateDoc complete.');
              }
            }
          }}
          roomId={mode === 'compete' ? roomId : null}
          player={mode === 'compete' ? playerNum : 1}
          mode={mode}
          quizStarted={mode === 'practice' ? true : quizStarted}
        />
      )}

      {/* Results Component */}
          {results && (
        <Result
          results={results}
          playerName={player && player.name ? player.name : undefined}
          playerNum={playerNum}
          playerNames={playerNames}
          player={player}
          rating={rating}
          prevRating={results && results.prevRating !== undefined ? results.prevRating : 0}
          ratingChange={results && results.ratingChange !== undefined ? results.ratingChange : 0}
          finalRating={results && results.finalRating !== undefined ? results.finalRating : rating}
          debugWinner={results && results.debugWinner !== undefined ? results.debugWinner : ''}
          debugPlayerId={results && results.debugPlayerId !== undefined ? results.debugPlayerId : ''}
          onRestart={() => {
            console.log('[Result Page] Restarting quiz, resetting game state.');
            setMode(null);
            setRoomId(null);
            setDomain(null);
            setResults(null);
            setPlayerNames({});
            setQuizStarted(false);
          }}
        />
      )}
      {/* Host waiting for player 2 */}
      {mode === 'compete' && roomId && playerNum === 1 && domain && !quizStarted && !results && (
        <WaitingRoom
          roomId={roomId}
          isHost={true}
          playerNames={playerNames}
          onQuizStart={() => setQuizStarted(true)}
        />
      )}

      {/* Waiting modal for player 2 */}
      {mode === 'compete' && roomId && playerNum === 2 && !quizStarted && !results && (
        <WaitingRoom
          roomId={roomId}
          isHost={false}
          playerNames={playerNames}
        />
      )}
    </div>
  );
}

export default App;