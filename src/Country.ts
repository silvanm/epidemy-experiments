import { HealthState, Person } from "@/Person";
import { Position, resolveCollision, Vector } from "@/Utils";
import { StatEntry } from "@/Stats";
import { Store } from "vuex";
import { StoreState } from "@/store";
import { borderPosXRelative, borderWidth } from "@/config/config";

export class Country {
  width: number;
  height: number;
  people: Person[];
  lastTs: number;
  store: Store<StoreState>;

  constructor(
    width: number,
    height: number,
    people: Person[] = [],
    store: Store<StoreState>
  ) {
    this.people = people;
    this.width = width;
    this.height = height;
    this.lastTs = Date.now();
    this.store = store;
  }

  createPeople(
    population: number,
    radius: number,
    durationOfIllness: number,
    deathRate: number,
    socialDistancingRate: number,
    store: Store<StoreState>
  ): void {
    for (let i = 0; i < population; i++) {
      const position: Position = {
        x: Math.random() * this.width,
        y: Math.random() * this.height
      };

      const direction = Math.PI * 2 * Math.random();

      const speed: Vector = {
        x: Math.cos(direction) * 0.08,
        y: Math.sin(direction) * 0.08
      };
      const person = new Person(
        position,
        speed,
        radius,
        durationOfIllness,
        deathRate,
        store
      );
      person.setSocialDistancingRate(socialDistancingRate);
      person.start();
      this.people.push(person);
    }

    // Adjust number of users with app tracking
    store.watch(
      state => {
        return state.appTrackingPenetration;
      },
      v => {
        this.updateAppTrackingState(v);
      }
    );

    this.updateAppTrackingState(store.state.appTrackingPenetration);
  }

  private updateAppTrackingState(v: number) {
    for (let i = 0; i < this.people.length; i++) {
      this.people[i].hasAppTracking = i < v;
    }
  }

  infectPeople(number: number): void {
    const arr = [];
    while (arr.length < number) {
      const r = Math.floor(Math.random() * this.people.length) + 1;
      if (arr.indexOf(r) === -1) {
        this.people[r].infect();
        arr.push(r);
      }
    }
  }

  static distance(p1: Person, p2: Person): number {
    return (
      Math.pow(p1.position.x - p2.position.x, 2) +
      Math.pow(p1.position.y - p2.position.y, 2)
    );
  }

  private checkCollisions(): void {
    for (let i = 0; i < this.people.length; i++) {
      if (this.people[i].state == HealthState.Dead) continue;

      for (let j = i + 1; j < this.people.length; j++) {
        if (this.people[j].state == HealthState.Dead) continue;

        const someoneHasAppTracking =
          this.people[i].hasAppTracking || this.people[j].hasAppTracking;

        if (
          Country.distance(this.people[i], this.people[j]) <
          Math.pow(
            this.people[i].logicalRadius + this.people[j].logicalRadius,
            2
          )
        ) {
          resolveCollision(this.people[i], this.people[j]);

          // Someone with app tracking will not infect anyone
          if (!someoneHasAppTracking) {
            // Infection
            if (
              this.people[i].state == HealthState.Infected &&
              this.people[j].state == HealthState.Healthy
            )
              this.people[j].infect(this.people[i]);

            if (
              this.people[j].state == HealthState.Infected &&
              this.people[i].state == HealthState.Healthy
            )
              this.people[i].infect(this.people[j]);
          }
        }
      }
    }
  }

  updatePosition(socialDistancingRate: number): void {
    const now = Date.now();
    const delta = now - this.lastTs;
    this.people.forEach((person: Person) => {
      person.setSocialDistancingRate(socialDistancingRate);
      if (person.atHome) {
        // don't move if person is at home
      } else {
        person.position.x += person.speed.x * delta;
        person.position.y += person.speed.y * delta;
      }

      this._handleWallCollision(person);
      this._handleBoundaryCollision(person);
    });
    this.lastTs = now;

    this.checkCollisions();
  }

  private _handleWallCollision(person: Person) {
    // Top wall
    if (person.position.y < person.radius) {
      person.position.y = -(person.position.y - person.radius) + person.radius;
      person.speed.y = -person.speed.y;
    }

    // Left wall
    if (person.position.x < person.radius) {
      person.position.x = -(person.position.x - person.radius) + person.radius;
      person.speed.x = -person.speed.x;
    }

    // right wall
    if (person.position.x > this.width - person.radius) {
      person.position.x =
        2 * this.width - (person.position.x + person.radius) - person.radius;
      person.speed.x = -person.speed.x;
    }

    // bottom wall
    if (person.position.y > this.height - person.radius) {
      person.position.y =
        2 * this.height - (person.position.y + person.radius) - person.radius;
      person.speed.y = -person.speed.y;
    }
  }

  private _handleBoundaryCollision(person: Person) {
    const borderHeight = Math.floor(
      ((this.height * this.store.state.borderClosingRate) / 100) * 0.5
    );
    const borderLeftEdge = Math.floor(this.width * borderPosXRelative);

    // slip between the gap
    if (
      person.position.y > borderHeight &&
      person.position.y < this.height - borderHeight
    )
      return;

    if (
      // move to the right
      person.speed.x > 0 &&
      person.position.x + person.radius > borderLeftEdge &&
      person.position.x + person.radius < borderLeftEdge + borderWidth / 2
    ) {
      person.speed.x = -person.speed.x;
    } else if (
      // move to the left
      person.speed.x < 0 &&
      person.position.x - person.radius < borderLeftEdge + borderWidth &&
      person.position.x - person.radius > borderLeftEdge + borderWidth / 2
    ) {
      person.speed.x = -person.speed.x;
    }
  }

  getStats(): StatEntry {
    const stat: { [k: string]: number } = {};
    for (const healthState in HealthState) {
      stat[HealthState[healthState]] = this.people.filter((p: Person) => {
        return p.state.toString() == HealthState[healthState];
      }).length;
    }

    return {
      timestamp: Date.now(),
      populations: stat
    };
  }
}
