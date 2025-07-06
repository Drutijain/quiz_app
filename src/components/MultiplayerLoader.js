// src/components/MultiplayerLoader.js

import React, { useEffect, useState } from 'react';
import QuizPage from './QuizPage';

const gameID = 'gm685a7f2d8b980';

function MultiplayerLoader({ domain, mode, setResults }) {
  const [quizReady, setQuizReady] = useState(false);
  const [roomID, setRoomID] = useState(null);
  const [playerInfo, setPlayerInfo] = useState(null);

  useEffect(() => {
    if (!window.moitribeGS) {
      console.error("❌ Moitribe SDK not loaded.");
      return;
    }

    window.moitribeGS(gameID, "init", {
      div: "root",
      isUnity: false,
      unityGameInstanceName: null,
      loginCallback: ({ success, playerdata }) => {
        if (success) {
          console.log("✅ Login successful:", playerdata);
          setPlayerInfo(playerdata);

          if (mode === 'match') {
            handleMatchmaking();
          } else if (mode === 'room') {
            handleRoomFlow();
          }
        } else {
          alert("❌ Login failed");
        }
      },
      rtmTest: true,
      onMessageError: (err) => {
        console.error("🛑 MQTT error:", err);
        alert("❌ Real-time error. Try a different network.");
      },
      connectionCallbacks: {
        onSignedOut: () => console.log("🔒 Signed out"),
        onApiObsolete: () => console.warn("⚠️ SDK outdated"),
        onServiceDown: (from, to) => {
          console.warn("🚫 Moitribe service down:", from, "→", to);
          alert("⚠️ Moitribe service temporarily down. Try again later.");
        }
      }
    }, (res) => {
      console.log("📦 SDK Init Result:", res);
    });
  }, [mode]);

  const handleRoomConnected = ({ status, room }) => {
    console.log("🔗 onRoomConnected");
    if (status) {
      alert("✅ Connected to room: " + room.roomID);
      setRoomID(room.roomID);
      setQuizReady(true);
    }
  };

  const handleMatchmaking = () => {
    console.log("🔍 Starting matchmaking...");

    const params = {
      roomSize: 2,
      autoMatch: true,
      waitTime: 20,
      retryTime: 10,
      variant: 1,
      exclusive_bitmask: "00000001",
      onRoomCreated: handleRoomConnected,
      onRoomConnected: handleRoomConnected,
    };

    window.moitribeGS(gameID, "createstandardroom", params, (res) => {
      console.log("➡️ Matchmaking SDK response:", res);
    });
  };

  const handleRoomFlow = () => {
    const choice = prompt("Enter Room ID to join, or leave blank to create one:");

    const params = {
      roomSize: 2,
      autoMatch: false,
      waitTime: 20,
      retryTime: 10,
      variant: 1,
      exclusive_bitmask: "00000001",
      onRoomCreated: ({ status, room }) => {
        console.log("🚀 onRoomCreated");
        if (status) {
          alert("✅ Room created! Share this ID: " + room.roomID);
          setRoomID(room.roomID);
          setQuizReady(true);
        } else {
          alert("❌ Room creation failed");
        }
      },
      onRoomJoined: ({ status, room }) => {
        console.log("👥 onRoomJoined");
        if (status) {
          alert("✅ Joined room: " + room.roomID);
          setRoomID(room.roomID);
          setQuizReady(true);
        }
      },
      onRoomConnected: handleRoomConnected,
    };

    if (choice) {
      params.invitationID = choice;
      console.log("🔗 Attempting to join room:", choice);

      window.moitribeGS(gameID, "joinstandardroominvcode", params, (res) => {
        console.log("➡️ Join room SDK response:", res);

        if (!res.success) {
          alert("❌ Failed to join room: " + res.reason);
        } else {
          alert("✅ SDK JOINED ROOM, waiting to confirm...");

          let retryCount = 0;

          const checkStatusLoop = () => {
            console.log(`🔄 [Retry ${retryCount + 1}] Checking room status...`);

            try {
              window.moitribeGS(gameID, "getcurrentroomstatus", {}, (status) => {
                console.log("🧪 Manual room check:", status);

                if (
                  status.success &&
                  status.room &&
                  status.room.roomID &&
                  status.room.players &&
                  status.room.players.length >= 2
                ) {
                  alert("✅ Confirmed in room with 2 players!");
                  setRoomID(status.room.roomID);
                  setQuizReady(true);
                } else if (retryCount < 5) {
                  retryCount++;
                  setTimeout(checkStatusLoop, 2000);
                } else {
                  alert("❌ Could not confirm room join after retries.");
                }
              });
            } catch (err) {
              console.error("❌ Error during room status check:", err);
            }
          };

          setTimeout(() => {
            console.log("🟡 Starting manual room status checks...");
            checkStatusLoop();
          }, 3000);
        }
      });

    } else {
      console.log("🛠️ Creating new room...");

      window.moitribeGS(gameID, "createstandardroom", params, (res) => {
        console.log("➡️ Create room SDK response:", res);
      });
    }
  };

  if (!quizReady) {
    return <p>🔄 Setting up multiplayer game... Please wait.</p>;
  }

  return (
    <QuizPage
      domain={domain}
      setResults={setResults}
      roomID={roomID}
      playerInfo={playerInfo}
    />
  );
}

export default MultiplayerLoader;
