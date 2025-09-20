import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  update,
  DataSnapshot,
} from "firebase/database";
import { GameState } from "../Enums/GameState";

const firebaseConfig = {
  apiKey: "AIzaSyCihVdfxSATzTX6Lg9bYgk2g4m0xXr2Iok",
  authDomain: "professorlex-6b34b.firebaseapp.com",
  databaseURL:
    "https://professorlex-6b34b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "professorlex-6b34b",
  storageBucket: "professorlex-6b34b.firebasestorage.app",
  messagingSenderId: "842077138673",
  appId: "1:842077138673:web:1080f33ece832941414350",
  measurementId: "G-N3H663LG1N",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export type RoomPlayer = {
  id: string;
  name: string;
  score: number;
  foundWords: string[];
  isHost: boolean;
};

export type Room = {
  id: string;
  name: string;
  players: { [key: string]: RoomPlayer };
  grid: any;
  gameState: GameState;
  startTime?: number;
  gameDuration: number;
};

export const createRoom = async (roomName: string, hostName: string) => {
  try {
    console.log("Creating room with name:", roomName);
    const roomId = Math.random().toString(36).substring(2, 8);
    const playerId = Math.random().toString(36).substring(2, 10);

    const room: Room = {
      id: roomId,
      name: roomName,
      players: {
        [playerId]: {
          id: playerId,
          name: hostName,
          score: 0,
          foundWords: [],
          isHost: true,
        },
      },
      grid: null,
      gameState: GameState.Waiting,
      gameDuration: 60,
    };

    console.log("Room object:", room);
    console.log("Saving to path:", `rooms/${roomId}`);

    await set(ref(db, `rooms/${roomId}`), room);
    console.log("Room created successfully");
    return { roomId, playerId };
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

export const joinRoom = async (roomId: string, playerName: string) => {
  // First check if the room exists
  const roomRef = ref(db, `rooms/${roomId}`);
  const snapshot = await new Promise<DataSnapshot>((resolve) => {
    onValue(roomRef, resolve, { onlyOnce: true });
  });

  const room = snapshot.val() as Room;
  if (!room) {
    throw new Error("Room not found");
  }

  const playerId = Math.random().toString(36).substring(2, 10);
  const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);

  const newPlayer: RoomPlayer = {
    id: playerId,
    name: playerName,
    score: 0,
    foundWords: [],
    isHost: false,
  };

  await set(playerRef, newPlayer);
  return playerId;
};

export const updateRoomName = async (roomId: string, newName: string) => {
  await update(ref(db, `rooms/${roomId}`), { name: newName });
};

export const updatePlayerScore = async (
  roomId: string,
  playerId: string,
  score: number,
  foundWords: string[]
) => {
  await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
    score,
    foundWords,
  });
};

export const startGame = async (roomId: string, grid: any) => {
  const db = getDatabase();
  const roomRef = ref(db, `rooms/${roomId}`);

  // First get the current room state
  const snapshot = await new Promise<DataSnapshot>((resolve) => {
    onValue(roomRef, resolve, { onlyOnce: true });
  });

  const room = snapshot.val() as Room;
  if (!room) return;

  // Ensure all players have foundWords array
  const updatedPlayers = Object.entries(room.players).reduce(
    (acc, [playerId, player]) => {
      acc[playerId] = {
        ...player,
        score: player.score || 0,
        foundWords: player.foundWords || [],
      };
      return acc;
    },
    {} as Record<string, RoomPlayer>
  );

  // Update the room with the new state
  await update(ref(db, `rooms/${roomId}`), {
    gameState: GameState.Playing,
    grid,
    startTime: Date.now(),
    players: updatedPlayers,
  });
};

export const endGame = async (roomId: string) => {
  await update(ref(db, `rooms/${roomId}`), {
    gameState: GameState.Finished,
  });
};

export const leaveRoom = async (roomId: string, playerId: string) => {
  await remove(ref(db, `rooms/${roomId}/players/${playerId}`));
};

export const subscribeToRoom = (
  roomId: string,
  callback: (room: Room) => void
) => {
  const roomRef = ref(db, `rooms/${roomId}`);
  const unsubscribe = onValue(roomRef, (snapshot) => {
    const room = snapshot.val();
    callback(room);
  });
  return unsubscribe;
};

export const getRoomRef = (roomId: string) => ref(db, `rooms/${roomId}`);
