import React, { useState } from 'react';
import { FaUserCircle, FaTrophy, FaMoon, FaSun } from 'react-icons/fa';
import './HamburgerMenu.css';

function HamburgerMenu({
  onProfile,
  onLeaderboard,
  onToggleTheme,
  theme
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="hamburger-menu-container">
      <button
        className={`hamburger-btn${open ? ' open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      {open && (
        <>
          <div className="dropdown-backdrop" onClick={() => setOpen(false)}></div>
          <div className="dropdown-menu">
            <button onClick={() => { setOpen(false); onProfile(); }}>
              <FaUserCircle /> Profile
            </button>
            <button onClick={() => { setOpen(false); onLeaderboard(); }}>
              <FaTrophy /> Leaderboard
            </button>
            <button onClick={() => { setOpen(false); onToggleTheme(); }}>
              {theme === 'light' ? <FaMoon /> : <FaSun />}
              {theme === 'light' ? ' Dark mode' : ' Light mode'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default HamburgerMenu;
