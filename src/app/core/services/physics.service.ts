import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PhysicsService {
  // Initial values as static constants
  private static readonly INITIAL_GRAVITY = -2;
  private static readonly INITIAL_THRUST = 10;
  private static readonly INITIAL_MAX_UPWARD_VELOCITY = 400;
  private static readonly INITIAL_MAX_DOWNWARD_VELOCITY = -200;
  private static readonly INITIAL_DECELERATION = -1;

  velocity = 0;
  gravity = PhysicsService.INITIAL_GRAVITY;
  thrust = PhysicsService.INITIAL_THRUST;
  maxUpwardVelocity = PhysicsService.INITIAL_MAX_UPWARD_VELOCITY;
  maxDownwardVelocity = PhysicsService.INITIAL_MAX_DOWNWARD_VELOCITY;
  deceleration = PhysicsService.INITIAL_DECELERATION;

  isFlying = false;

  setVelocity(value: number): void {
    this.velocity = Math.max(
      Math.min(value, this.maxUpwardVelocity),
      this.maxDownwardVelocity
    ); // Set velocity within bounds
  }

  applyThrust(): void {
    if (!this.isFlying) {
      this.startFlying();
    }
    const thrustMultiplier = 1 / 20; // For 50ms update interval
    this.setVelocity(this.velocity + this.thrust * thrustMultiplier * 60);
  }
  applyGravity(): void {
    if (this.isFlying) {
      this.applyThrust();
    } else {
      // Apply gravity when not flying
      if (this.gravity === 0) {
        this.handleZeroGravityDeceleration();
      } else {
        this.handleGravityWithAirResistance();
      }
    }
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
    // Reset all values to initial state
    this.velocity = 0;
    this.gravity = PhysicsService.INITIAL_GRAVITY;
    this.thrust = PhysicsService.INITIAL_THRUST;
    this.maxUpwardVelocity = PhysicsService.INITIAL_MAX_UPWARD_VELOCITY;
    this.maxDownwardVelocity = PhysicsService.INITIAL_MAX_DOWNWARD_VELOCITY;
    this.deceleration = PhysicsService.INITIAL_DECELERATION;
    this.isFlying = false;
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
      this.setVelocity(this.velocity + this.deceleration); // Decelerate upward motion
      if (this.velocity < 0) {
        this.velocity = 0; // Stop at 0 in zero gravity
      }
    }
  }

  private handleGravityWithAirResistance(): void {
    // Apply gravity first
    this.setVelocity(this.velocity + this.gravity);

    // Then apply air resistance if moving upward
    if (this.velocity > 0) {
      const airResistance = Math.min(
        this.velocity * 0.1,
        Math.abs(this.deceleration)
      );
      this.setVelocity(this.velocity - airResistance);
    }
  }
}
