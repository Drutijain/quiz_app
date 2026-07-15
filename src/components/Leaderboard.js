import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Leaderboard.css';

function Leaderboard({ onClose }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const playerList = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          if (data && typeof data.rating === 'number' && data.name) {
            playerList.push({
              id: docSnap.id,
              name: data.name,
              rating: data.rating
            });
          }
        });
        // Sort descending by rating
        playerList.sort((a, b) => b.rating - a.rating);
        setPlayers(playerList);
      } catch (err) {
        setPlayers([]);
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="leaderboard-modal">
      <div className="leaderboard-content">
        <button className="close-btn" onClick={onClose}>Close</button>
        <h2>Leaderboard</h2>
        {loading ? (
          <div className="leaderboard-loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, idx) => (
                <tr key={player.id} className={idx < 3 ? `rank-${idx + 1}` : ''}>
                  <td className="rank-cell mono-num">{idx < 3 ? medals[idx] : idx + 1}</td>
                  <td>{player.name}</td>
                  <td className="mono-num">{player.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {(!loading && players.length === 0) && <div className="leaderboard-empty">No players have competed yet.</div>}
      </div>
    </div>
  );
}

export default Leaderboard;
