"use client";

import { useState } from "react";
import AddPlayerModal from "./AddPlayerModal";
import PlayerProfile from "./PlayerProfile";
import DepthChart from "./DepthChart";

const LISTS = [
  "Hot List",
  "Player of Interest",
  "Tracking",
  "Contacted NMU",
  "Committed",
  "Transfer Portal"
];

export default function RecruitBoard() {

  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showDepthChart, setShowDepthChart] = useState(false);

  function addPlayer(player) {
    setPlayers((prev) => [...prev, player]);
    setShowAddPlayer(false);
  }

  function deletePlayer(id) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setSelectedPlayer(null);
  }

  function movePlayer(playerId, newStatus) {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId ? { ...p, status: newStatus } : p
      )
    );
  }

  const safePlayers = Array.isArray(players) ? players : [];

  return (
    <div style={{ padding: 24 }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
      }}>
        <h1>NMU Hockey Recruiting Board</h1>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowAddPlayer(true)}>
            Add Player
          </button>

          <button onClick={() => setShowDepthChart(true)}>
            Depth Chart
          </button>
        </div>
      </div>

      {/* BOARD */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 16
      }}>

        {LISTS.map((status) => {

          const listPlayers =
            safePlayers.filter((p) => p.status === status) || [];

          return (
            <div
              key={status}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 10,
                minHeight: 300
              }}
            >
              <h3>{status}</h3>

              {listPlayers.map((player) => (
                <div
                  key={player.id}
                  style={{
                    border: "1px solid #ccc",
                    padding: 8,
                    marginTop: 8,
                    borderRadius: 6,
                    cursor: "pointer",
                    background: "#fafafa"
                  }}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <b>{player.name}</b>
                  <div>{player.position}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* MODALS */}

      {showAddPlayer && (
        <AddPlayerModal
          onClose={() => setShowAddPlayer(false)}
          onAdd={addPlayer}
        />
      )}

      {selectedPlayer && (
        <PlayerProfile
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onDelete={() => deletePlayer(selectedPlayer.id)}
        />
      )}

      {showDepthChart && (
        <DepthChart
          players={safePlayers}
          onClose={() => setShowDepthChart(false)}
        />
      )}

    </div>
  );
}
