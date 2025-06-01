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
