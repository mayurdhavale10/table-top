"use client";

import Link from "next/link";
import "../styles/GamesBanner.css";

export default function GamesBanner({ cafeSlug = "sips-and-bites" }: { cafeSlug?: string }) {
  return (
    <div className="games-banner-container">
      <div className="games-header">
        <h2>Arcade</h2>
        <Link href={`/${cafeSlug}/games`} className="see-all-link">See all &rarr;</Link>
      </div>
      
      <div className="games-scroll">
        <Link href={`/${cafeSlug}/games/baddie-detector`} className="game-card baddie-detector">
          <div className="game-icon">💅</div>
          <div className="game-info">
            <h3>Baddie Detector</h3>
            <p>Scan your face to find out</p>
          </div>
        </Link>
        
        <Link href={`/${cafeSlug}/games/tic-tac-toe`} className="game-card tic-tac-toe">
          <div className="game-icon">❌</div>
          <div className="game-info">
            <h3>Tic Tac Toe</h3>
            <p>Challenge a friend</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
