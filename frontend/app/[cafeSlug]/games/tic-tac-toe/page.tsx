"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const params = useParams();
  const cafeSlug = Array.isArray(params?.cafeSlug) ? params.cafeSlug[0] : params?.cafeSlug || "sips-and-bites";

  const calculateWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);

  const handleClick = (i: number) => {
    if (board[i] || winner) return;

    const newBoard = [...board];
    newBoard[i] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px", minHeight: "100vh", background: "#FAF8F5", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", alignSelf: "flex-start" }}>
        <Link href={`/${cafeSlug}/games`} style={{ color: "#0f9d58", textDecoration: "none", fontWeight: "bold", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
          <ArrowLeft size={20} /> Back to Games
        </Link>
      </div>

      <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "32px", color: "#1A1817", marginTop: "32px", marginBottom: "8px", textAlign: "center" }}>
        Tic Tac Toe
      </h1>
      <p style={{ color: "#7A7571", textAlign: "center", marginBottom: "32px" }}>
        Challenge a friend while you wait
      </p>

      <div style={{
        background: "#FDFBF9",
        padding: "24px",
        borderRadius: "24px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.04)"
      }}>
        {/* Status */}
        <div style={{ 
          textAlign: "center", 
          marginBottom: "24px", 
          fontSize: "20px", 
          fontWeight: "bold",
          color: winner ? "#16a34a" : isDraw ? "#d97706" : "#1A1817"
        }}>
          {winner ? `Winner: ${winner} 🎉` : isDraw ? "It's a Draw! 🤝" : `Next Player: ${xIsNext ? "X" : "O"}`}
        </div>

        {/* Board */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {board.map((square, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              style={{
                width: "80px",
                height: "80px",
                background: square ? "#fff" : "#f4f4f4",
                border: "none",
                borderRadius: "16px",
                fontSize: "40px",
                fontWeight: "bold",
                color: square === "X" ? "#3b82f6" : "#ec4899",
                cursor: square || winner ? "default" : "pointer",
                boxShadow: square ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {square}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={resetGame}
        style={{
          marginTop: "40px",
          background: "#1A1817",
          color: "white",
          border: "none",
          padding: "16px 40px",
          borderRadius: "30px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          transition: "0.2s"
        }}
      >
        RESTART GAME
      </button>
    </div>
  );
}
