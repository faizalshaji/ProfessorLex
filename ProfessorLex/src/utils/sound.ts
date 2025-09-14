// Create audio elements for each sound
const validWordSound = new Audio("/ProfessorLex/sounds/valid-word.mp3");
const invalidWordSound = new Audio("/ProfessorLex/sounds/invalid-word.mp3");
const gameOverSound = new Audio("/ProfessorLex/sounds/game-over.mp3");

// Log sound file paths for debugging
console.log("Sound file paths:", {
  valid: validWordSound.src,
  invalid: invalidWordSound.src,
  gameOver: gameOverSound.src,
});

// Preload sounds
validWordSound.load();
invalidWordSound.load();
gameOverSound.load();

// Set volumes
validWordSound.volume = 0.5;
invalidWordSound.volume = 0.4;
gameOverSound.volume = 0.6;

export const playValidWord = () => {
  validWordSound.currentTime = 0;
  validWordSound.play().catch(console.error);
};

export const playInvalidWord = () => {
  invalidWordSound.currentTime = 0;
  invalidWordSound.play().catch(console.error);
};

export const playGameOver = () => {
  gameOverSound.currentTime = 0;
  gameOverSound.play().catch(console.error);
};
