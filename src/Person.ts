import { Vector, Position } from "@/Utils";
import { Store } from "vuex";

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
  hasAppTracking = false;
  // Bidirectional Contact tracking
  contactee!: Person[];
  contacter!: Person[];
  store: Store<any>;
  private socialDistancingRate = 0;

  constructor(
    position: Position,
    speed: Vector,
    radius: number,
    durationOfIllness: number,
    deathRate: number,
    store: Store<any>
  ) {
    this.position = position;
    this.speed = speed;
    this.radius = radius;
    this.state = HealthState.Healthy;
    this.infectedAt = null;
    this.durationOfIllness = durationOfIllness;
    this.deathRate = deathRate;
    this.atHome = false;
    this.store = store;
    this.contactee = [];
    this.contacter = [];
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

  private getDeathRate(): number {
    let deathRate = this.store.state.deathRate;
    if (this.store.state.statEntries.length > 0) {
      const lastStatEntry = this.store.state.statEntries[
        this.store.state.statEntries.length - 1
      ];
      if (
        lastStatEntry.populations[HealthState.Infected] >
        this.store.state.hospitalCapacity
      ) {
        deathRate = this.store.state.deathRateWithoutTreatment;
      }
    }
    return deathRate;
  }

  get logicalRadius(): number {
    if (this.hasAppTracking) {
      return this.radius * 2;
    }
    return this.radius;
  }

  die() {
    this.state = HealthState.Dead;
    this.speed = { x: 0, y: 0 };
  }

  infect(infecter: Person | null = null) {
    // infection does only work if someone is healthy
    if (this.state === HealthState.Healthy) {
      this.state = HealthState.Infected;
      this.infectedAt = Date.now();
      window.setTimeout(() => {
        if (Math.random() < this.getDeathRate() / 100) {
          this.die();
        } else {
          this.state = HealthState.Healed;
        }
      }, this.durationOfIllness * 1000);
    }
  }

  enableAppTracking(enable: boolean) {
    if (enable) {
      this.hasAppTracking = true;
    } else {
      this.hasAppTracking = false;
      this.contactee = [];
    }
  }
}
