export interface Obstacle {
  x: number; // Horizontal position
  y: number; // Vertical position
  type: string; // Obstacle type (e.g., 'planet', 'tree')
  image: string; // Path to obstacle image
  size: number; // Size of obstacle
  speed: number; // Speed of obstacle
}
