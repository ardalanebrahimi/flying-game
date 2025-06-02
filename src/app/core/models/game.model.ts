export interface GameState {
  score: number;
  playerX: number;
  playerY: number;
  exploded: boolean;
  currentStage: string;
  lives: number;
  isInvincible: boolean;
  invincibilityTimer: number;
  countdownTimer: number;
  isRecovering: boolean;
  hasWon: boolean;
  targetHeight: number;
  isButtonPressed: boolean; // Track if the thrust button is being held
}
