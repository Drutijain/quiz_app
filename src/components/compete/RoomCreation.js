import React from 'react';
import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './RoomCreation.css';

function RoomCreation({ onRoomCreated, player }) {
  const createRoom = async () => {
    const docRef = await addDoc(collection(db, 'rooms'), {
      created: Date.now(),
      player1Name: player && player.name ? player.name : 'Player 1',
      player1Id: player && player.id ? player.id : '',
      quizStarted: false,
      results: false
    });
    onRoomCreated(docRef.id, 1);
  };

  const joinRoom = async () => {
    const roomCode = prompt('Enter Room Code:');
    if (roomCode) {
      const roomRef = doc(db, 'rooms', roomCode);
      const roomSnap = await getDoc(roomRef);
      if (!roomSnap.exists()) {
        alert('Room not found.');
        return;
      }
      // Join as player 2
      await updateDoc(roomRef, {
        player2Name: player && player.name ? player.name : 'Player 2',
        player2Id: player && player.id ? player.id : ''
      });
      onRoomCreated(roomCode, 2);
    }
  };

  return (
    <div className="room-modal">
      <div className="room-modal-content">
        <h2>Choose an Option</h2>
        <div className="room-buttons">
          <button onClick={createRoom}>Create Room</button>
          <button onClick={joinRoom}>Join Room</button>
        </div>
      </div>
    </div>
  );
}

export default RoomCreation;
