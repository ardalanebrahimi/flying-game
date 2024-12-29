export interface Stage {
  name: string; // Name of the stage (e.g., 'Earth’s Surface')
  gravity: number; // Gravity value for the stage
  maxSpeed: number; // Max speed for the stage
  deceleration: number; // Deceleration value
  background: string; // Background CSS or path
  heightRange: [number, number]; // Height range for the stage
}
