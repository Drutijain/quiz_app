import React, { useEffect, useState } from 'react';

/**
 * Props:
 * - domain: string (selected quiz domain)
 * - player: object (current player profile)
 * - onMatch: function(room, participants, isCreator)
 * - onFail: function(errorMsg)
 */
function OnlineMatchLoader({ domain, player, onMatch, onFail }) {
  const [status, setStatus] = useState('matching'); // 'matching' | 'waiting' | 'failed'
  const [message, setMessage] = useState('Matching you with another player...');
  const [roomId, setRoomId] = useState(null);
  const [roomObj, setRoomObj] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const gameID = 'gm685a7f2d8b980';
    let createdRoomId = null;
    let joinedRoomId = null;
    let left = false;
    let rtmParams = null;

    // Helper: leave and cleanup
    function leaveRoomAndFail(msg) {
      if (left) return;
      left = true;
      setStatus('failed');
      setMessage(msg);
      if (createdRoomId) {
        window.moitribeGS(gameID, 'leavestandardroom', { roomid: createdRoomId }, () => {
          console.log('[OnlineMatch] Left and deleted created room:', createdRoomId);
        });
      } else if (joinedRoomId) {
        window.moitribeGS(gameID, 'leavestandardroom', { roomid: joinedRoomId }, () => {
          console.log('[OnlineMatch] Left joined room:', joinedRoomId);
        });
      }
      if (timeoutId) clearTimeout(timeoutId);
      if (onFail) onFail(msg);
    }

    // Helper: start quiz
    function startQuiz(room, participants, isCreator) {
      if (timeoutId) clearTimeout(timeoutId);
      setStatus('matched');
      setMessage('Match found! Starting quiz...');
      if (onMatch) onMatch(room, participants, isCreator);
    }

    // 1. Try to join a vacant room (simulate: always create for demo, or implement room listing if SDK supports)
    // For now, always create a room (since SDK does not provide room listing in docs)
    setMessage('No vacant room found. Creating a new room...');
    setIsCreator(true);
    // RTMStandardParams
    rtmParams = {
      roomSize: 2,
      retryTime: 10,
      waitTime: 10,
      autoMatch: true,
      variant: domain, // Use domain as variant for matching
      invitedPlayerIDs: [],
      min_automatch_players: 2,
      max_automatch_players: 2,
      exclusive_bitmask: '0',
      onRoomCreated: function({ status, room }) {
        console.log('[OnlineMatch] onRoomCreated', status, room);
        if (!status) {
          leaveRoomAndFail('Failed to create room.');
          return;
        }
        createdRoomId = room.roomID;
        setRoomId(room.roomID);
        setRoomObj(room);
        setMessage('Room created. Waiting for another player to join...');
      },
      onJoinedRoom: function({ status, room }) {
        console.log('[OnlineMatch] onJoinedRoom', status, room);
        joinedRoomId = room.roomID;
        setRoomId(room.roomID);
        setRoomObj(room);
        setMessage('Joined room. Waiting for another player...');
      },
      onPeerJoined: function({ room, participantList }) {
        console.log('[OnlineMatch] onPeerJoined', room, participantList);
        setParticipants(participantList);
        if (participantList.length >= 2) {
          startQuiz(room, participantList, createdRoomId === room.roomID);
        }
      },
      onPeerLeft: function({ room, participantList }) {
        console.log('[OnlineMatch] onPeerLeft', room, participantList);
      },
      onMessageReceived: function({ messageData, senderParticipantID, isReliable }) {
        // Handle real-time messages
      },
      onLeftRoom: function({ status, roomID }) {
        console.log('[OnlineMatch] onLeftRoom', status, roomID);
      },
      onRoomConnected: function({ status, room }) {
        console.log('[OnlineMatch] onRoomConnected', status, room);
      },
    };
    // Add a random delay before calling createstandardroom to reduce race condition
    const randomDelay = Math.floor(Math.random() * 1000); // 0-999 ms
    setTimeout(() => {
      console.log('[OnlineMatch] Attempting to create automatch room with params:', {
        roomSize: 2,
        retryTime: 10,
        waitTime: 10,
        autoMatch: true,
        variant: domain,
        invitedPlayerIDs: [],
        min_automatch_players: 2,
        max_automatch_players: 2,
        exclusive_bitmask: '0',
      });
      rtmParams = {
        roomSize: 2,
        retryTime: 10,
        waitTime: 10,
        autoMatch: true,
        variant: domain,
        invitedPlayerIDs: [],
        min_automatch_players: 2,
        max_automatch_players: 2,
        exclusive_bitmask: '0',
        onRoomCreated: function({ status, room }) {
          console.log('[OnlineMatch] onRoomCreated', status, room);
          if (!status) {
            leaveRoomAndFail('Failed to create room.');
            return;
          }
          createdRoomId = room.roomID;
          setRoomId(room.roomID);
          setRoomObj(room);
          setMessage('Room created. Waiting for another player to join...');
        },
        onJoinedRoom: function({ status, room }) {
          console.log('[OnlineMatch] onJoinedRoom', status, room);
          joinedRoomId = room.roomID;
          setRoomId(room.roomID);
          setRoomObj(room);
          setMessage('Joined room. Waiting for another player...');
        },
        onPeerJoined: function({ room, participantList }) {
          console.log('[OnlineMatch] onPeerJoined', room, participantList);
          setParticipants(participantList);
          if (participantList.length >= 2) {
            startQuiz(room, participantList, createdRoomId === room.roomID);
          }
        },
        onPeerLeft: function({ room, participantList }) {
          console.log('[OnlineMatch] onPeerLeft', room, participantList);
        },
        onMessageReceived: function({ messageData, senderParticipantID, isReliable }) {
          // Handle real-time messages
        },
        onLeftRoom: function({ status, roomID }) {
          console.log('[OnlineMatch] onLeftRoom', status, roomID);
        },
        onRoomConnected: function({ status, room }) {
          console.log('[OnlineMatch] onRoomConnected', status, room);
        },
      };
      window.moitribeGS(gameID, 'createstandardroom', rtmParams, function(cbObj) {
        console.log('[OnlineMatch] createstandardroom callback', cbObj);
        if (!cbObj.success) {
          leaveRoomAndFail('Could not create room.');
          return;
        }
        // Wait for peer for 2 minutes
        const tId = setTimeout(() => {
          leaveRoomAndFail('No players online.');
        }, 120000);
        setTimeoutId(tId);
      });
    }, randomDelay);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (createdRoomId) {
        window.moitribeGS(gameID, 'leavestandardroom', { roomid: createdRoomId }, () => {
          console.log('[OnlineMatch] Cleanup: left room', createdRoomId);
        });
      }
    };
    // eslint-disable-next-line
  }, [domain]);

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h2>{message}</h2>
      {status === 'failed' && <button onClick={() => window.location.reload()}>Try Again</button>}
    </div>
  );
}

export default OnlineMatchLoader;
