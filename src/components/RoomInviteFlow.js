import React, { useState } from 'react';
import RoomQuizPage from './RoomQuizPage';

function RoomInviteFlow({ domain, player, onFinish, onBack }) {
  const [step, setStep] = useState('choose'); // choose | create | join | waiting | quiz
  const [roomId, setRoomId] = useState('');
  const [roomObj, setRoomObj] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [error, setError] = useState('');
  const [startQuiz, setStartQuiz] = useState(false);
  const [inputId, setInputId] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  // Step 1: Choose create or join
  if (step === 'choose') {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>Room Match</h2>
        <button onClick={() => setStep('create')}>Create Room</button>
        <button onClick={() => setStep('join')}>Join Room</button>
        <button onClick={onBack} style={{ marginLeft: 16 }}>Back</button>
      </div>
    );
  }

  // Step 2: Create room
  if (step === 'create') {
    // Call SDK to create room
    if (!roomId) {
      const gameID = 'gm685a7f2d8b980';
      const rtmParams = {
        roomSize: 2,
        retryTime: 10,
        waitTime: 10,
        autoMatch: false,
        variant: domain,
        invitedPlayerIDs: [],
        min_automatch_players: 2,
        max_automatch_players: 2,
        exclusive_bitmask: '0', // Use '0' for both create and join
        onRoomCreated: function(obj) {
          console.log('[RoomInvite] onRoomCreated', obj);
          if (!obj.status) {
            setError('Failed to create room.');
            setStep('choose');
            return;
          }
          setRoomId(obj.room.roomID);
          setRoomObj(obj.room);
          setIsCreator(true);
          console.log('[RoomInvite] Room created with ID:', obj.room.roomID);
        },
        onPeerJoined: function(obj) {
          console.log('[RoomInvite] onPeerJoined', obj);
          setParticipants(obj.participantList);
          if (obj.participantList.length >= 2) {
            setStep('waiting');
            setTimeout(() => setStartQuiz(true), 3000);
          }
        },
        onMessageReceived: function(obj) {
          // handled in quiz page
        },
        onJoinedRoom: function(obj) {
          console.log('[RoomInvite] onJoinedRoom', obj);
        },
        onLeftRoom: function(obj) {
          console.log('[RoomInvite] onLeftRoom', obj);
        },
      };
      console.log('[RoomInvite] Creating room with params:', rtmParams);
      window.moitribeGS(gameID, 'createstandardroom', rtmParams, function(cbObj) {
        console.log('[RoomInvite] createstandardroom callback', cbObj);
        if (!cbObj.success) {
          setError('Could not create room. Reason: ' + (cbObj.reason || 'unknown'));
          setStep('choose');
        }
      });
      return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Creating room...</div>;
    }
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>Room Created</h2>
        <div>Share this Room ID with your friend:</div>
        <div style={{ fontWeight: 'bold', fontSize: '1.3em', margin: '1rem' }}>{roomId}</div>
        <div>Waiting for another player to join...</div>
        {participants.length === 2 && <div>Both players joined! Starting quiz in 3 seconds...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    );
  }

  // Step 3: Join room
  if (step === 'join') {
    if (joining) {
      return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Joining room...</div>;
    }
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>Join Room</h2>
        <input value={inputId} onChange={e => setInputId(e.target.value)} placeholder="Enter Room ID" />
        <button onClick={() => {
          setJoining(true);
          const gameID = 'gm685a7f2d8b980';
          const rtmParams = {
            roomSize: 2,
            retryTime: 10,
            waitTime: 10,
            autoMatch: false,
            variant: domain,
            invitedPlayerIDs: [],
            min_automatch_players: 2,
            max_automatch_players: 2,
            exclusive_bitmask: '0', // Use '0' for both create and join
            onJoinedRoom: function(obj) {
              console.log('[RoomInvite] onJoinedRoom', obj);
              if (!obj.status) {
                setJoinError('Failed to join room.');
                setJoining(false);
                return;
              }
              setRoomId(obj.room.roomID);
              setRoomObj(obj.room);
              console.log('[RoomInvite] Joined room with ID:', obj.room.roomID);
            },
            onPeerJoined: function(obj) {
              console.log('[RoomInvite] onPeerJoined', obj);
              setParticipants(obj.participantList);
              if (obj.participantList.length >= 2) {
                setStep('waiting');
                setTimeout(() => setStartQuiz(true), 3000);
              }
            },
            onMessageReceived: function(obj) {
              // handled in quiz page
            },
            onLeftRoom: function(obj) {
              console.log('[RoomInvite] onLeftRoom', obj);
            },
          };
          console.log('[RoomInvite] Attempting to join room with ID:', inputId, 'and params:', rtmParams);
          window.moitribeGS(gameID, 'joinstandardroominvcode', { ...rtmParams, invitationID: inputId }, function(cbObj) {
            console.log('[RoomInvite] joinstandardroominvcode callback', cbObj);
            if (!cbObj.success) {
              setJoinError('Could not join room. Reason: ' + (cbObj.reason || 'unknown'));
              setJoining(false);
            }
          });
        }}>Join</button>
        <button onClick={() => setStep('choose')} style={{ marginLeft: 16 }}>Back</button>
        {joinError && <div style={{ color: 'red' }}>{joinError}</div>}
      </div>
    );
  }

  // Step 4: Waiting for quiz
  if (step === 'waiting') {
    return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Both players joined! Starting quiz in 3 seconds...</div>;
  }

  // Step 5: Quiz
  if (startQuiz && roomObj && participants.length === 2) {
    return <RoomQuizPage room={roomObj} participants={participants} player={player} isCreator={isCreator} domain={domain} onFinish={onFinish} />;
  }

  return null;
}

export default RoomInviteFlow;
