import { Vector, Position } from "@/Utils";
import EventBus from "@/event-bus";

export enum HealthState {
  Healthy,
  Infected,
  Healed,
  Dead
}

export class Person {
  position: Position;
  speed: Vector;
  radius: number;
  infectedAt: number | null;
  state: HealthState;
  durationOfIllness: number;
  deathRate: number;
  atHome: boolean;
  private socialDistancingRate = 0;

  constructor(
    position: Position,
    speed: Vector,
    radius: number,
    durationOfIllness: number,
    deathRate: number
  ) {
    this.position = position;
    this.speed = speed;
    this.radius = radius;
    this.state = HealthState.Healthy;
    this.infectedAt = null;
    this.durationOfIllness = durationOfIllness;
    this.deathRate = deathRate;
    this.atHome = false;
  }

  start() {
    window.setTimeout(() => {
        this.updateState();
      }, Math.random() * 1000);
  }

  updateState(initial = false) {
    if (!this.atHome) {
      window.setTimeout(() => {
        this.updateState();
      }, 3000 * (this.socialDistancingRate / 100));
    } else {
      window.setTimeout(() => {
        this.updateState();
      }, 1000);
    }
    this.atHome = !this.atHome;
  }

  setSocialDistancingRate(r: number) {
    this.socialDistancingRate = r;
  }

  infect() {
    // infection does only work if someone is healthy
    if (this.state === HealthState.Healthy) {
      this.state = HealthState.Infected;
      this.infectedAt = Date.now();
      window.setTimeout(() => {
        if (Math.random() < this.deathRate / 100) {
          this.state = HealthState.Dead;
          this.speed = { x: 0, y: 0 };
        } else {
          this.state = HealthState.Healed;
        }
      }, this.durationOfIllness * 1000);
    }
  }
}
