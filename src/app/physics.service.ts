import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PhysicsService {
  velocity = 0; // Vertical velocity
  gravity = -2; // Gravity force
  thrust = 10; // Rocket thrust force per input
  maxUpwardVelocity = 400; // Maximum upward speed
  maxDownwardVelocity = -200; // Maximum downward speed

  applyThrust(): void {
    this.velocity += this.thrust; // Apply thrust
    if (this.velocity > this.maxUpwardVelocity) {
      this.velocity = this.maxUpwardVelocity; // Cap upward velocity
    }
  }

  applyGravity(): void {
    this.velocity += this.gravity; // Apply gravity
    if (this.velocity < this.maxDownwardVelocity) {
      this.velocity = this.maxDownwardVelocity; // Cap downward velocity
    }
  }

  getVelocity(): number {
    return this.velocity; // Return current velocity
  }

  reset(): void {
    this.velocity = 0; // Reset velocity
  }
}
