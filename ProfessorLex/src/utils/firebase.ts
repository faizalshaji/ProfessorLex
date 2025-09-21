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
  gridSize?: number;
};

// Generate a GUID/UUID v4 for player IDs
function uuidv4(): string {
  // Use native if available
  // @ts-ignore - crypto may not have randomUUID in some environments
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
    // @ts-ignore
    return (crypto as any).randomUUID();
  }
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // Set version and variant per RFC 4122
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
    return (
      hex.slice(0, 4).join("") +
      "-" +
      hex.slice(4, 6).join("") +
      "-" +
      hex.slice(6, 8).join("") +
      "-" +
      hex.slice(8, 10).join("") +
      "-" +
      hex.slice(10, 16).join("")
    );
  }
  // Fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Generate a readable room ID (10-15 chars) with pronounceable segments + digits
function generateRoomId(): string {
  const consonants = [
    "b",
    "c",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "m",
    "n",
    "p",
    "r",
    "s",
    "t",
    "v",
    "w",
    "y",
    "z",
  ];
  const vowels = ["a", "e", "i", "o", "u"];
  const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const syllable = () =>
    rand(consonants) +
    rand(vowels) +
    (Math.random() < 0.3 ? rand(consonants) : "");

  // Build 3-4 syllables then add 2-4 digits to land between 10-15 total
  const syllableCount = Math.random() < 0.5 ? 3 : 4;
  let id = "";
  for (let i = 0; i < syllableCount; i++) id += syllable();
  const digitsCount = 2 + Math.floor(Math.random() * 3); // 2-4 digits
  for (let i = 0; i < digitsCount; i++)
    id += Math.floor(Math.random() * 10).toString();

  // Ensure length bounds: trim or pad with random digits
  if (id.length > 15) id = id.slice(0, 15);
  while (id.length < 10) id += Math.floor(Math.random() * 10).toString();
  return id;
}

export const createRoom = async (
  roomName: string,
  hostName: string,
  options?: { gridSize?: number; gameDuration?: number }
) => {
  try {
    console.log("Creating room with name:", roomName);
    const roomId = generateRoomId();
    const playerId = uuidv4();

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
      gameDuration: options?.gameDuration ?? 60,
      gridSize: options?.gridSize,
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
  if (room.gameState && room.gameState !== GameState.Waiting) {
    throw new Error("Game already started. Joining is disabled.");
  }

  const playerId = uuidv4();
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

export const updatePlayerName = async (
  roomId: string,
  playerId: string,
  name: string
) => {
  await update(ref(db, `rooms/${roomId}/players/${playerId}`), { name });
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
