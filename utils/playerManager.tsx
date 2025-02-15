import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

interface Player {
  id: string;
  username: string;
  score: number;
}

class PlayerManager {
  async addPlayer(id: string, username: string): Promise<void> {
    const playerRef = doc(db, 'players', id);
    const playerDoc = await getDoc(playerRef);
    
    if (!playerDoc.exists()) {
      await setDoc(playerRef, {
        id,
        username,
        score: 0,
        createdAt: new Date(),
        lastActive: new Date()
      });
    } else {
      await updateDoc(playerRef, {
        username,
        lastActive: new Date()
      });
    }
  }

  async getPlayer(id: string): Promise<Player | null> {
    const playerRef = doc(db, 'players', id);
    const playerDoc = await getDoc(playerRef);
    
    if (playerDoc.exists()) {
      return playerDoc.data() as Player;
    }
    return null;
  }

  async updateScore(id: string, points: number): Promise<void> {
    const playerRef = doc(db, 'players', id);
    await updateDoc(playerRef, {
      score: increment(points),
      lastActive: new Date()
    });
  }
}

export const playerManager = new PlayerManager();