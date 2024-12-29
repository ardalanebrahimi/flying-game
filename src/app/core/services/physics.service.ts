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
    this.velocity = Math.min(
      this.velocity + this.thrust,
      this.maxUpwardVelocity
    ); // Apply thrust and cap upward velocity
  }

  applyGravity(): void {
    if (this.isFlying) {
      this.velocity = Math.min(
        this.velocity + this.thrust,
        this.maxUpwardVelocity
      ); // Apply thrust while flying
    } else if (this.gravity === 0) {
      this.handleZeroGravityDeceleration(); // Decelerate in zero-gravity stages
    } else {
      this.handleGravityWithAirResistance(); // Apply gravity and air resistance
    }

    // Ensure velocity remains within defined limits
    this.velocity = Math.max(
      Math.min(this.velocity, this.maxUpwardVelocity),
      this.maxDownwardVelocity
    );
  }

  getVelocity(): number {
    return this.velocity; // Return the current velocity
  }

  startFlying(): void {
    this.isFlying = true;
  }

  stopFlying(): void {
    this.isFlying = false;
  }

  reset(): void {
    this.velocity = 0; // Reset velocity
    this.isFlying = false; // Reset flying state
  }

  setGravity(value: number): void {
    this.gravity = value; // Dynamically set gravity
  }

  setThrust(value: number): void {
    this.thrust = value; // Dynamically set thrust
  }

  setMaxUpwardVelocity(value: number): void {
    this.maxUpwardVelocity = value; // Dynamically set max upward velocity
  }

  setMaxDownwardVelocity(value: number): void {
    this.maxDownwardVelocity = value; // Dynamically set max downward velocity
  }

  setDeceleration(value: number): void {
    this.deceleration = value; // Dynamically set deceleration
  }

  private handleZeroGravityDeceleration(): void {
    if (this.velocity > 0) {
      this.velocity += this.deceleration; // Decelerate upward motion
      if (this.velocity < 0) {
        this.velocity = 0; // Stop at 0 in zero gravity
      }
    }
  }

  private handleGravityWithAirResistance(): void {
    this.velocity += this.gravity; // Apply gravity

    if (this.velocity > 0) {
      this.velocity += this.deceleration; // Apply air resistance to upward motion
    }
  }
}
