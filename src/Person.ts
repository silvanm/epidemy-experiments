import { Vector, Position } from "@/Utils";

export enum HealthState {
  Healthy,
  Infected,
  Healed
}

export class Person {
  position: Position;
  speed: Vector;
  radius: number;
  infectedAt: number | null;
  state: HealthState;
  healed = false;

  constructor(position: Position, speed: Vector, radius: number) {
    this.position = position;
    this.speed = speed;
    this.radius = radius;
    this.state = HealthState.Healthy;
    this.infectedAt = null;
  }

  infect() {
    // infection does only work if someone is healthy
    if (this.state === HealthState.Healthy) {
      this.state = HealthState.Infected;
      this.infectedAt = Date.now();
      window.setTimeout(() => {
        this.state = HealthState.Healed;
      }, 10000);
    }
  }
}
