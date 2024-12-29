import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PhysicsService {
  velocity = 0; // Vertical velocity
  gravity = -2; // Gravity force
  thrust = 10; // Rocket thrust force per input
  maxUpwardVelocity = 400; // Maximum upward speed
  maxDownwardVelocity = -200; // Maximum downward speed
  deceleration = -1; // Deceleration factor to reduce velocity when not flying

  isFlying = false;

  applyThrust(): void {
    this.startFlying(); // Set flying state
    this.velocity += this.thrust; // Apply thrust
    if (this.velocity > this.maxUpwardVelocity) {
      this.velocity = this.maxUpwardVelocity; // Cap upward velocity
    }
  }

  applyGravity(): void {
    if (this.isFlying) {
      this.velocity += this.thrust; // Apply thrust when flying
    } else {
      if (this.gravity === 0) {
        // Decelerate in zero-gravity stages only until velocity reaches 0
        if (this.velocity > 0) {
          this.velocity += this.deceleration; // Decelerate upward motion
          if (this.velocity < 0) {
            this.velocity = 0; // Stop at 0 in zero gravity
          }
        }
      } else {
        // Apply gravity in stages with gravity
        this.velocity += this.gravity;

        // Apply deceleration for air resistance
        if (this.velocity > 0) {
          this.velocity += this.deceleration;
        }
      }
    }

    // Cap the velocity within the defined limits
    if (this.velocity > this.maxUpwardVelocity) {
      this.velocity = this.maxUpwardVelocity;
    }

    if (this.velocity < this.maxDownwardVelocity) {
      this.velocity = this.maxDownwardVelocity;
    }
  }

  getVelocity(): number {
    return this.velocity; // Return current velocity
  }

  startFlying(): void {
    this.isFlying = true;
  }

  stopFlying(): void {
    this.isFlying = false;
  }

  reset(): void {
    this.velocity = 0; // Reset velocity
  }
}
