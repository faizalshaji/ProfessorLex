// Simple localStorage helpers for username and room-specific session

export type RoomSession = {
  playerId: string;
  playerName: string;
  isHost: boolean;
};

const USERNAME_KEY = "plx:username";
const roomKey = (roomId: string) => `plx:room:${roomId}`;

export function getUserName(): string | null {
  try {
    return localStorage.getItem(USERNAME_KEY);
  } catch {
    return null;
  }
}

export function setUserName(name: string) {
  try {
    localStorage.setItem(USERNAME_KEY, name);
  } catch {
    // no-op
  }
}

export function getRoomSession(roomId: string): RoomSession | null {
  try {
    const raw = localStorage.getItem(roomKey(roomId));
    if (!raw) return null;
    return JSON.parse(raw) as RoomSession;
  } catch {
    return null;
  }
}

export function setRoomSession(roomId: string, session: RoomSession) {
  try {
    localStorage.setItem(roomKey(roomId), JSON.stringify(session));
  } catch {
    // no-op
  }
}

export function clearRoomSession(roomId: string) {
  try {
    localStorage.removeItem(roomKey(roomId));
  } catch {
    // no-op
  }
}
