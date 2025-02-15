import { db } from '../firebase/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export interface GameState {
  id: string;
  players: {
    [key: string]: {
      id: string;
      username: string;
      score: number;
      guesses: string[];
    };
  };
  word: string;
  currentTurn: string;
  status: 'waiting' | 'active' | 'finished';
  lastMoveTimestamp: number;
}

export class GameManager {
  private gamesRef = 'games';

  async createGame(gameId: string, player1Id: string, player2Id: string): Promise<GameState> {
    const gameState: GameState = {
      id: gameId,
      players: {
        [player1Id]: {
          id: player1Id,
          username: '',
          score: 0,
          guesses: [],
        },
        [player2Id]: {
          id: player2Id,
          username: '',
          score: 0,
          guesses: [],
        },
      },
      word: this.getRandomWord(),
      currentTurn: player1Id,
      status: 'waiting',
      lastMoveTimestamp: Date.now(),
    };

    await setDoc(doc(db, this.gamesRef, gameId), gameState);
    return gameState;
  }

  subscribeToGame(gameId: string, callback: (game: GameState) => void) {
    return onSnapshot(doc(db, this.gamesRef, gameId), (doc) => {
      if (doc.exists()) {
        callback(doc.data() as GameState);
      }
    });
  }

  async updateGameState(gameId: string, updates: Partial<GameState>) {
    await updateDoc(doc(db, this.gamesRef, gameId), updates);
  }

  private getRandomWord() {
    const words = ['REACT', 'LOGIC', 'DEBUG', 'CLASS', 'ARRAY'];
    return words[Math.floor(Math.random() * words.length)];
  }
}

export const gameManager = new GameManager();
