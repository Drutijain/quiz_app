import React from 'react';
import './Profile.css';


function Profile({ player, onClose, rating }) {
  return (
    <div className="profile-modal">
      <div className="profile-content">
        <button className="profile-close" onClick={onClose} aria-label="Close">&times;</button>
        <div className="profile-pic-container">
          {player && player.profileicon ? (
            <img src={player.profileicon} alt="Profile" className="profile-pic" />
          ) : (
            <div className="profile-pic-placeholder">No picture</div>
          )}
        </div>
        <div className="profile-info">
          <div className="profile-name">{player && player.name ? player.name : 'Guest player'}</div>
          <div className="profile-rating-badge">
            <span className="profile-rating-label">Rating</span>
            <span className="mono-num profile-rating-value">{typeof rating === 'number' ? Math.round(rating) : 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
